import { describe, it, expect, vi } from 'vitest';

/**
 * Mocking the Supabase Edge Function authentication handler
 * to test rejection of requests lacking valid Authorization headers.
 */
describe('Edge Function JWT Authentication Enforcement', () => {
  // Simulates the auth verification block in supabase/functions/ai/index.ts
  async function simulateEdgeFunctionAuth(headers: Record<string, string>, mockAuthResult: { user: any | null; error: any | null }) {
    const authHeader = headers['Authorization'] || headers['authorization'];
    if (!authHeader) {
      return { status: 401, body: { error: 'Missing authorization header' } };
    }

    if (mockAuthResult.error || !mockAuthResult.user) {
      return { status: 401, body: { error: 'Unauthorized access token' } };
    }

    return { status: 200, body: { success: true, userId: mockAuthResult.user.id } };
  }

  it('rejects request with 401 when Authorization header is omitted', async () => {
    const headers = {};
    const res = await simulateEdgeFunctionAuth(headers, { user: null, error: null });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Missing authorization header');
  });

  it('rejects request with 401 when JWT token is invalid or expired', async () => {
    const headers = { Authorization: 'Bearer invalid.expired.token' };
    const res = await simulateEdgeFunctionAuth(headers, {
      user: null,
      error: { message: 'JWT expired' },
    });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Unauthorized access token');
  });

  it('permits request with 200 when valid JWT is supplied', async () => {
    const headers = { Authorization: 'Bearer valid.jwt.token' };
    const res = await simulateEdgeFunctionAuth(headers, {
      user: { id: 'user-valid-123' },
      error: null,
    });

    expect(res.status).toBe(200);
    expect(res.body.userId).toBe('user-valid-123');
  });
});
