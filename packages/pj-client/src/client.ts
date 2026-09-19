import type { ChatRequest, ChatResponse, EcosystemInfo, ProfessorJOptions } from '@learninghub/pj-types';

const DEFAULT_MODEL = 'google/gemini-3.7-flash';

function getBackendUrl(baseUrl?: string): string {
  if (baseUrl) return baseUrl;
  if (typeof window !== 'undefined') {
    const envUrl = (import.meta as any).env?.VITE_PROFESSOR_J_URL;
    if (envUrl) return envUrl;
  }
  return '';
}

export async function chat(request: ChatRequest, options: ProfessorJOptions = {}): Promise<ChatResponse> {
  const baseUrl = getBackendUrl(options.baseUrl);
  
  const response = await fetch(`${baseUrl}/api/v1/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(options.apiKey ? { 'Authorization': `Bearer ${options.apiKey}` } : {}),
    },
    body: JSON.stringify({
      messages: request.messages,
      model: request.model || DEFAULT_MODEL,
      max_tokens: request.max_tokens || 800,
      system_prompt: request.system_prompt,
    }),
  });

  if (!response.ok) {
    throw new Error(`P-J chat request failed: ${response.status}`);
  }

  return response.json();
}

export async function getEcosystemInfo(options: ProfessorJOptions = {}): Promise<EcosystemInfo> {
  const baseUrl = getBackendUrl(options.baseUrl);
  
  try {
    const response = await fetch(`${baseUrl}/api/v1/lh/ecosystem-info`);
    if (response.ok) return response.json();
  } catch {
    // Fallback
  }
  
  return {
    services: {
      learninghub: { role: 'information-head', responsibilities: ['knowledge', 'governance', 'content'], status: 'active' },
      'professor-j': { role: 'worker', responsibilities: ['ai-execution', 'orchestration'], status: 'active' },
    },
    integration: { protocol: 'http+json', auth: 'api-key', endpoints: { chat: '/api/v1/chat' } },
  };
}

export async function healthCheck(options: ProfessorJOptions = {}): Promise<boolean> {
  const baseUrl = getBackendUrl(options.baseUrl);
  
  try {
    const response = await fetch(`${baseUrl}/api/v1/lh/health`);
    return response.ok;
  } catch {
    return false;
  }
}
