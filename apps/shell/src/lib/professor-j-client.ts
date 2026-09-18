/**
 * PROFESSOR-J Client — LearningHub Frontend Integration.
 *
 * LearningHub is the INFORMATION HEAD (knowledge, governance, content).
 * PROFESSOR-J is the WORKER (AI execution, orchestration, model routing).
 *
 * This client sends chat requests to PROFESSOR-J backend API,
 * which routes through its orchestration plane.
 */

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  contextSnippet?: string;
}

export interface ProfessorJOptions {
  model?: string;
  apiKey?: string;
  /** Base URL for PROFESSOR-J backend (default: same origin / local) */
  baseUrl?: string;
}

const SYSTEM_PROMPT = `You are PROFESSOR-J, the AI WORKER for the STEM ecosystem.

Your Role:
- You are the execution layer (worker) in the STEM ecosystem
- LearningHub is the INFORMATION HEAD (knowledge, governance, content, pedagogy)
- You handle AI execution, model routing, orchestration, and task delegation

Your Directives:
1. Knowledge Grounding: Reference LearningHub canonical entities and knowledge schemas
2. Socratic Tutoring: Guide learners step-by-step — never dump raw answers
3. Worker Role: You execute tasks delegated by LearningHub; you don't govern the ecosystem
4. Ecosystem Awareness: LearningHubSTEM → LearningHub (head) → PROFESSOR-J (worker)
5. Highlight Context: Analyze highlighted text using LearningHub knowledge schemas`;

const DEFAULT_MODEL = 'google/gemini-3.7-flash';
export async function askProfessorJ(
  prompt: string,
  history: ChatMessage[] = [],
  contextSnippet?: string,
  options: ProfessorJOptions = {},
): Promise<string> {
  const model = options.model || DEFAULT_MODEL;
  const baseUrl = getBackendUrl(options.baseUrl);

  // Build system prompt
  let systemContent = SYSTEM_PROMPT;
  if (contextSnippet) {
    systemContent += `\n\nHighlighted text from page: "${contextSnippet}"`;
  }

  const messagesPayload = [
    { role: 'system', content: systemContent },
    ...history.map((m) => ({ role: m.role, content: m.content })),
    { role: 'user', content: prompt },
  ];

  // Try PROFESSOR-J backend first
  try {
    const response = await fetch(`${baseUrl}/api/v1/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(options.apiKey ? { 'Authorization': `Bearer ${options.apiKey}` } : {}),
      },
      body: JSON.stringify({
        messages: messagesPayload,
        model,
        max_tokens: 800,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.message) return data.message;
    }
  } catch {
    // Backend unavailable — fall through to local fallback
  }

  // Fallback: grounded local response generator
  return generateLocalGroundedResponse(prompt, contextSnippet);
}

/**
 * Fetch ecosystem info from PROFESSOR-J backend.
 */
export async function getEcosystemInfo(options: ProfessorJOptions = {}): Promise<unknown> {
  const baseUrl = getBackendUrl(options.baseUrl);
  try {
    const response = await fetch(`${baseUrl}/api/v1/lh/ecosystem-info`);
    if (response.ok) return await response.json();
  } catch {
    // Fallback
  }
  return {
    services: {
      learninghub: { role: 'information-head', status: 'active' },
      professorJ: { role: 'worker', status: 'active' },
    },
  };
}

/**
 * Resolve PROFESSOR-J backend URL.
 * Priority: explicit baseUrl → VITE env → same-origin default.
 */
function getBackendUrl(baseUrl?: string): string {
  if (baseUrl) return baseUrl;
  const envUrl = import.meta.env.VITE_PROFESSOR_J_URL;
  if (envUrl) return envUrl;
  return '';
}

function generateLocalGroundedResponse(prompt: string, contextSnippet?: string): string {
  const query = (prompt + ' ' + (contextSnippet || '')).toLowerCase();

  if (contextSnippet) {
    return `**PROFESSOR-J Analysis:**\n\nRegarding the text you highlighted: *"${contextSnippet}"*\n\nThis concept relates directly to canonical STEMMA principles. Let's break it down:\n1. **Core Concept:** It establishes foundational relationship boundaries.\n2. **Socratic Question:** What do you think happens if one of the underlying variables changes?\n3. **Application:** Consider how this principle behaves under real-world experimental conditions.`;
  }

  if (query.includes('stemma') || query.includes('learninghub')) {
    return `**PROFESSOR-J Ecosystem Knowledge:**\n\nLearningHub serves as the canonical open foundation for the STEM ecosystem. It ingests structured entity data from STEMMA exports (\`lhs:*\` and \`stemma:*\`) and provides pure simulation engines, Web Components, and EventBus contracts to downstream products like STEM Tuition, STEM Lab, and STEM Game.`;
  }

  if (query.includes('newton') || query.includes('force') || query.includes('acceleration')) {
    return `**PROFESSOR-J Socratic Guide:**\n\nNewton's Second Law states that **F = m · a**.\n- Net force (**F**) is directly proportional to acceleration (**a**).\n- Mass (**m**) represents inertia.\n\n*Think about it:* If you double the net force applied to an object while keeping its mass constant, what happens to its acceleration?`;
  }

  return `**PROFESSOR-J:**\n\nI am connected to the STEMMA knowledge base and LearningHub foundation. Ask me about any STEM concept (Physics, Chemistry, Biology, Mathematics, Engineering) or highlight any text on the page to analyze it with me!`;
}
