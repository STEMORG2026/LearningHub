/**
 * DEPRECATED (ADR-016 N6). Superseded by the request-driven content engine.
 *
 * The v1 five-role assembly line moving forward is the pipeline runner
 * (`packages/content-engine/src/pipeline.ts`): `produce()` drives Request →
 * Blueprint → FormatGenerator(narrative-lesson) → deterministic + semantic
 * verification → targeted repair → hard-gate publish. This file is kept only as
 * a historical reference template; new content work must go through the engine.
 *
 * Narration assembly-line orchestration (reference template).
 *
 * This is the durable, documented shape of the multi-agent narration pipeline that a
 * runner executes (in this harness it is pasted into the `workflow` tool, which provides
 * the `agent`, `pipeline`, `parallel`, `phase`, `log` hooks). It implements the playbook
 * at docs/guides/task-playbooks/narration/README.md.
 *
 * Assembly-line semantics: `pipeline(items, ...stages)` advances each topic through the
 * stages independently with NO barrier — so topic A can be in "write" while topic B is in
 * "research" and topic C is being "master-reviewed". This is the concurrency the playbook
 * describes.
 *
 * Role prompts live in scripts/narrate/prompts/. A runner substitutes the {placeholders}
 * with the topic's canonical data and the prior stage's output.
 */
export const rolePrompts = {
  researcher: 'scripts/narrate/prompts/role-researcher.txt',
  writer: 'scripts/narrate/prompts/role-writer.txt',
  reviewer: 'scripts/narrate/prompts/role-reviewer.txt',
  masterReviewer: 'scripts/narrate/prompts/role-master-reviewer.txt',
};

/**
 * The pipeline DAG. `refine` is the retry loop: writer → content-review → master-review,
 * with up to `maxRounds` refinements before a topic is dropped from the batch.
 *
 * @param {Array<{conceptId:string,name:string,definition:string,symbol?:string,unit?:string,equation?:string}>} items
 * @param {{agent:Function,pipeline:Function,phase:Function,log:Function}} hooks
 */
export async function assemblyLine(items, hooks) {
  const { agent, pipeline, phase, log } = hooks;
  const MAX_ROUNDS = 2;

  phase('Narration assembly line');
  log(`Starting ${items.length} topic(s) through research → write → review → master-review`);

  const results = await pipeline(
    items,

    // Stage 1: RESEARCH
    async (__unused, item, idx) => {
      log(`[${idx}] researching ${item.conceptId}`);
      const prompt = `You are the RESEARCHER. Canonical entity:
CONCEPT_ID=${item.conceptId}
NAME=${item.name}
DEFINITION=${item.definition}
SYMBOL=${item.symbol} UNIT=${item.unit} EQUATION=${item.equation}
Produce a structured research dossier as JSON with keys: conceptId, canonicalDefinition,
symbol, unit, equation, history, figures[], timeline[], perspectives[],
whatCameBefore, connections[], applications[], misconceptions[], deepDive{phenomenon, curve{curious,enthusiast,professional,nerd}},
workedExamples[], analogies[], tryThis, funFacts[], unverifiedNotes[].
Never fabricate. Mark unverified facts in unverifiedNotes. Research real people with
recorded words and sources, respected/differing views with their standing, and concrete
real-world texture.`;
      const dossier = await agent(prompt, {
        schema: researchDossierSchema,
        label: `research:${item.conceptId.split('.').pop()}`,
        phase: 'Narration assembly line',
      });
      if (!dossier) throw new Error(`research failed for ${item.conceptId}`);
      return { item, dossier };
    },

    // Stage 2: WRITE
    async (prev, item, idx) => {
      const { dossier } = prev;
      log(`[${idx}] writing ${item.conceptId}`);
      const prompt = writerPrompt(item, dossier);
      const draftTs = await agent(prompt, {
        label: `write:${item.conceptId.split('.').pop()}`,
        phase: 'Narration assembly line',
      });
      if (!draftTs) throw new Error(`write failed for ${item.conceptId}`);
      return { item, dossier, draft: draftTs };
    },

    // Stage 3: CONTENT REVIEW
    async (prev, item, idx) => {
      const { dossier, draft } = prev;
      log(`[${idx}] content-reviewing ${item.conceptId}`);
      const prompt = `You are the CONTENT REVIEWER. Canonical definition: ${item.definition}.
Review this draft for factual/structure errors. Return JSON: {"verdict":"pass"|"revisions","issues":[{"field","problem","fix"}],"notes":[]}.
DRAFT:\n${draft}`;
      const findings = await agent(prompt, {
        schema: reviewFindingsSchema,
        label: `review:${item.conceptId.split('.').pop()}`,
        phase: 'Narration assembly line',
      });
      if (!findings) return { ...prev, reviewVerdict: 'fail' };
      return { ...prev, reviewVerdict: findings.verdict, issues: findings.issues };
    },

    // Stage 4: MASTER REVIEW + refine loop
    async (prev, item, idx) => {
      let current = prev;
      for (let round = 1; round <= MAX_ROUNDS + 1; round++) {
        // Ensure content review passed (fix on revisions, up to MAX_ROUNDS)
        if (current.reviewVerdict === 'revisions') {
          log(`[${idx}] refine content round ${round} for ${item.conceptId}`);
          const fixPrompt = `You are the WRITER. The Content Reviewer returned these issues:
${JSON.stringify(current.issues)}
Revise the draft to fix ALL issues and return the full corrected NarrativeContent TS object.
DRAFT:\n${current.draft}`;
          const fixed = await agent(fixPrompt, {
            label: `rewrite:${item.conceptId.split('.').pop()}`,
            phase: 'Narration assembly line',
          });
          current = { ...current, draft: fixed || current.draft };
        }

        const masterPrompt = `You are the MASTER REVIEWER. Canonical definition: ${item.definition}.
Rate this draft for story/readability/deepDiveScale/interactiveReady/humanity (0-5) and apply
the discovery checklist. Return JSON: {"gate":"approve"|"refine","scores":{...},
"refinements":[...],"notes":[]}.
DRAFT:\n${current.draft}`;
        const verdict = await agent(masterPrompt, {
          schema: masterVerdictSchema,
          label: `master:${item.conceptId.split('.').pop()}`,
          phase: 'Narration assembly line',
        });
        if (!verdict) {
          current = { ...current, gate: 'refine', masterNotes: ['reviewer failed'] };
        } else {
          current = { ...current, gate: verdict.gate, scores: verdict.scores,
            refinements: verdict.refinements };
        }

        if (current.gate === 'approve') break;

        // refine: writer incorporates master refinements
        if (round > MAX_ROUNDS) {
          log(`[${idx}] giving up on ${item.conceptId} after ${round} rounds`);
          break;
        }
        log(`[${idx}] master-refining round ${round} for ${item.conceptId}`);
        const refinePrompt = `You are the WRITER. The Master Reviewer requested improvements:
${JSON.stringify(current.refinements)}
Revise the draft to incorporate them fully and return the corrected NarrativeContent TS object.
DRAFT:\n${current.draft}`;
        const improved = await agent(refinePrompt, {
          label: `masterfix:${item.conceptId.split('.').pop()}`,
          phase: 'Narration assembly line',
        });
        current = { ...current, draft: improved || current.draft };
      }
      return { ...current, item };
    },
  );

  const approved = (results || []).filter(Boolean).filter((r) => r && r.gate === 'approve');
  const deferred = (results || []).filter(Boolean).filter((r) => r && r.gate !== 'approve');
  log(`approve=${approved.length} deferred=${deferred.length}`);
  return {
    approved: approved.map(({ item, dossier, draft }) => ({ conceptId: item.conceptId, dossier, draft })),
    deferred: deferred.map(({ item, gate, refinements, reviewVerdict }) => ({ conceptId: item.conceptId, gate, refinements, reviewVerdict })),
  };
}

// ------------------------------------------------------------------------------------
// JSON Schemas (object-rooted, JSON Schema subset supported by the workflow runner).
// ------------------------------------------------------------------------------------
export const researchDossierSchema = {
  type: 'object',
  additionalProperties: true,
  required: ['conceptId', 'history', 'figures', 'timeline', 'perspectives',
    'whatCameBefore', 'connections', 'applications', 'misconceptions', 'deepDive',
    'workedExamples', 'analogies', 'tryThis', 'funFacts'],
  properties: {
    conceptId: { type: 'string' },
    history: { type: 'string' },
    figures: { type: 'array', items: { type: 'object', additionalProperties: true } },
    timeline: { type: 'array', items: { type: 'object', additionalProperties: true } },
    perspectives: { type: 'array', items: { type: 'object', additionalProperties: true } },
    whatCameBefore: { type: 'string' },
    connections: { type: 'array', items: { type: 'string' } },
    applications: { type: 'array', items: { type: 'string' } },
    misconceptions: { type: 'array', items: { type: 'string' } },
    deepDive: { type: 'object', additionalProperties: true },
    workedExamples: { type: 'array', items: { type: 'string' } },
    analogies: { type: 'array', items: { type: 'string' } },
    tryThis: { type: 'string' },
    funFacts: { type: 'array', items: { type: 'string' } },
  },
};

export const reviewFindingsSchema = {
  type: 'object',
  additionalProperties: true,
  required: ['verdict'],
  properties: {
    verdict: { type: 'string', enum: ['pass', 'revisions'] },
    issues: { type: 'array', items: { type: 'object', additionalProperties: true } },
    notes: { type: 'array', items: { type: 'string' } },
  },
};

export const masterVerdictSchema = {
  type: 'object',
  additionalProperties: true,
  required: ['gate'],
  properties: {
    gate: { type: 'string', enum: ['approve', 'refine'] },
    scores: { type: 'object', additionalProperties: true },
    refinements: { type: 'array', items: { type: 'string' } },
    notes: { type: 'array', items: { type: 'string' } },
  },
};

function writerPrompt(item, dossier) {
  return `You are the WRITER. Canonical definition: ${item.definition}.
Write the complete NarrativeContent lesson (TypeScript object literal, every field required)
from this research dossier. Return ONLY the TS object literal.
RESEARCH DOSSIER:\n${JSON.stringify(dossier)}`;
}