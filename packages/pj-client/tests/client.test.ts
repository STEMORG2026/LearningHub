import { describe, it, expect, vi, beforeEach } from 'vitest';
import { chat, getEcosystemInfo, healthCheck } from '../src/client';

const mockFetch = vi.fn();
global.fetch = mockFetch;

beforeEach(() => {
  mockFetch.mockReset();
});

describe('pj-client', () => {
  describe('chat', () => {
    it('sends chat request to P-J backend', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Response', model: 'test', agent: 'professor-j' }),
      });

      const response = await chat({
        messages: [{ role: 'user', content: 'Hello' }],
      });

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/v1/chat',
        expect.objectContaining({ method: 'POST' })
      );
      expect(response.message).toBe('Response');
    });

    it('includes auth header when apiKey provided', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Response', model: 'test', agent: 'professor-j' }),
      });

      await chat(
        { messages: [{ role: 'user', content: 'Hello' }] },
        { apiKey: 'test-key' }
      );

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/v1/chat',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-key',
          }),
        })
      );
    });

    it('throws on failed request', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false, status: 500 });

      await expect(
        chat({ messages: [{ role: 'user', content: 'Hello' }] })
      ).rejects.toThrow('P-J chat request failed: 500');
    });
  });

  describe('getEcosystemInfo', () => {
    it('fetches ecosystem info from backend', async () => {
      const mockInfo = {
        services: {
          learninghub: { role: 'information-head', responsibilities: ['knowledge'], status: 'active' },
        },
        integration: { protocol: 'http+json', auth: 'api-key', endpoints: {} },
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockInfo,
      });

      const info = await getEcosystemInfo();
      expect(info.services.learninghub.role).toBe('information-head');
    });

    it('returns fallback on network error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const info = await getEcosystemInfo();
      expect(info.services.learninghub.role).toBe('information-head');
    });
  });

  describe('healthCheck', () => {
    it('returns true when backend is healthy', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true });
      expect(await healthCheck()).toBe(true);
    });

    it('returns false when backend is down', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));
      expect(await healthCheck()).toBe(false);
    });
  });
});
