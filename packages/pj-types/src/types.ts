export type ChatMessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  role: ChatMessageRole;
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  model: string;
  max_tokens: number;
  system_prompt?: string;
}

export interface ChatResponse {
  message: string;
  model: string;
  agent: string;
}

export interface ServiceInfo {
  role: string;
  responsibilities: string[];
  status: string;
}

export interface EcosystemInfo {
  services: Record<string, ServiceInfo>;
  integration: {
    protocol: string;
    auth: string;
    endpoints: Record<string, string>;
  };
}

export interface ProfessorJOptions {
  model?: string;
  apiKey?: string;
  baseUrl?: string;
}
