import { describe, it, expect, beforeAll } from 'vitest';
import { BASE_URL, waitForService } from './setup.js';

beforeAll(async () => {
  await waitForService();
}, 60_000);

describe('Storybook static site', () => {
  it('serves the index page with HTML content', async () => {
    const res = await fetch(`${BASE_URL}/`);
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toBe('text/html');
    const html = await res.text();
    expect(html).toContain('<html');
  });

  it('returns 404 for unknown paths', async () => {
    const res = await fetch(`${BASE_URL}/nonexistent-path-12345`);
    expect(res.status).toBe(404);
  });
});
