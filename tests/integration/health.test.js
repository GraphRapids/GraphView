import { describe, it, expect, beforeAll } from 'vitest';
import { BASE_URL, waitForService } from './setup.js';

beforeAll(async () => {
  await waitForService();
}, 60_000);

describe('GET /health', () => {
  it('returns 200 with status ok', async () => {
    const res = await fetch(`${BASE_URL}/health`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ status: 'ok' });
  });

  it('returns application/json content type', async () => {
    const res = await fetch(`${BASE_URL}/health`);
    expect(res.headers.get('content-type')).toBe('application/json');
  });
});
