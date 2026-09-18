/**
 * PROFESSOR-J Client — AI OS & Socratic Engine Integration.
 *
 * Connects LearningHub Web Shell to PROFESSOR-J / Google AI Studio (Gemini 3.7 / 2.5)
 * for grounded educational dialogue, text highlight analysis, and ecosystem Q&A.
 */

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  contextSnippet?: string;
}

export interface ProfessorJOptions {
  model?: string;
  apiKey?: string;
}

const SYSTEM_PROMPT = `You are PROFESSOR-J, the central Socratic AI Assistant and Ecosystem Intelligence Layer for LearningHub and STEMXIS TECHNOLOGY PVT. LTD.

Your Core Directives:
1. Knowledge Grounding: Ground all educational concepts in STEMMA canonical entities (Biology, Chemistry, Physics, Mathematics, Computer Science, Engineering).
2. Socratic Tutoring: Guide learners step-by-step with intuitive explanations, analogies, and key questions rather than dumping raw answers.
3. Ecosystem Awareness: You understand the entire STEM ecosystem architecture:
   - LearningHub: Canonical foundation, knowledge schemas, simulation math, Web Components.
   - STEM Tuition: Commercial 1:1, cohort, and guided tutoring consumer module.
   - STEM Lab: Virtual laboratory and interactive simulation sandbox.
   - STEM Game: Gamified quizzes, streaks, and learning challenges.
   - PROFESSOR-J: Socratic tutor and AI OS.
   - JARVIS: Independent Personal AI OS sharing platform infrastructure.
4. Highlight Context: When the user provides a highlighted text snippet from the page, directly analyze that text in relation to STEMMA concepts and offer clear, insightful guidance.`;

const DEFAULT_MODEL = 'google/gemini-3.7-flash';
/**
 * OpenRouter token, read from the build-time env var `VITE_OPENROUTER_API_KEY`.
 *
 * Never hardcode a credential here: this module is bundled into the served
 * client, so any literal sits in plaintext in `dist/`. The value is a
 * browser-visible key by construction — treat it as public and rate-limited,
 * not as a secret. When unset, the client falls through to the grounded local
 * responder below instead of firing an unauthenticated call.
 */
const API_TOKEN = import.meta.env.VITE_OPENROUTER_API_KEY ?? '';
export async function askProfessorJ(
  prompt: string,
  history: ChatMessage[] = [],
  contextSnippet?: string,
  options: ProfessorJOptions = {},
): Promise<string> {
  const model = options.model || DEFAULT_MODEL;

  const messagesPayload = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history.map((m) => ({ role: m.role, content: m.content })),
  ];

  let fullUserContent = prompt;
  if (contextSnippet) {
    fullUserContent = `[Highlighted Context from Page]: "${contextSnippet}"\n\nQuestion: ${prompt}`;
  }

  messagesPayload.push({ role: 'user', content: fullUserContent });

  // No credential configured: skip the network entirely and answer from the
  // grounded local generator. Firing the request anyway would only produce a
  // 401 that costs a round-trip and logs a misleading failure.
  const token = options.apiKey || API_TOKEN;
  if (!token) return generateLocalGroundedResponse(prompt, contextSnippet);

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        max_tokens: 800,
        messages: messagesPayload,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      if (content) return content;
    }
  } catch {
    // Fall back to grounded local response generator if network unavailable
  }

  return generateLocalGroundedResponse(prompt, contextSnippet);
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
