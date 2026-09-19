import { describe, it, expect } from 'vitest';
import type { ChatMessage, ChatRequest, ChatResponse, EcosystemInfo } from '../src/types';

describe('pj-types', () => {
  it('has valid ChatMessage type structure', () => {
    const msg: ChatMessage = { role: 'user', content: 'Hello' };
    expect(msg.role).toBe('user');
    expect(msg.content).toBe('Hello');
  });

  it('has valid ChatRequest type structure', () => {
    const req: ChatRequest = {
      messages: [{ role: 'user', content: 'Test' }],
      model: 'google/gemini-3.7-flash',
      max_tokens: 800,
    };
    expect(req.messages.length).toBe(1);
    expect(req.model).toBe('google/gemini-3.7-flash');
    expect(req.max_tokens).toBe(800);
  });

  it('has valid ChatResponse type structure', () => {
    const resp: ChatResponse = {
      message: 'Response text',
      model: 'test-model',
      agent: 'professor-j',
    };
    expect(resp.message).toBe('Response text');
    expect(resp.agent).toBe('professor-j');
  });

  it('has valid EcosystemInfo type structure', () => {
    const info: EcosystemInfo = {
      services: {
        learninghub: {
          role: 'information-head',
          responsibilities: ['knowledge', 'governance'],
          status: 'active',
        },
      },
      integration: {
        protocol: 'http+json',
        auth: 'api-key',
        endpoints: { chat: '/api/v1/chat' },
      },
    };
    expect(info.services.learninghub.role).toBe('information-head');
    expect(info.integration.protocol).toBe('http+json');
  });
});
