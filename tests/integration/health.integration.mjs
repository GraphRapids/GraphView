const BASE_URL = process.env.GRAPHVIEW_URL || 'http://localhost:8080';

/**
 * Wait for the service to become healthy with exponential backoff.
 * @param {string} url - Base URL of the service
 * @param {object} options
 * @param {number} options.retries - Maximum retry attempts
 * @param {number} options.initialDelay - Initial delay in ms (doubles each retry)
 * @param {number} options.maxDelay - Maximum delay between retries in ms
 */
async function waitForService(url, { retries = 20, initialDelay = 500, maxDelay = 3000 } = {}) {
  let delay = initialDelay;
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(`${url}/health`);
      if (res.ok) return;
    } catch {
      // Service not ready yet
    }
    await new Promise((resolve) => setTimeout(resolve, delay));
    delay = Math.min(delay * 2, maxDelay);
  }
  throw new Error(`Service at ${url} did not become healthy within ${retries} attempts`);
}

beforeAll(async () => {
  await waitForService(BASE_URL);
}, 60_000);

describe('Health check endpoint', () => {
  it('GET /health returns 200 with { status: "ok" }', async () => {
    const res = await fetch(`${BASE_URL}/health`);

    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('application/json');

    const body = await res.json();
    expect(body).toEqual({ status: 'ok' });
  });

  it('GET /health is idempotent across multiple requests', async () => {
    const results = await Promise.all(
      Array.from({ length: 3 }, () => fetch(`${BASE_URL}/health`)),
    );
    for (const res of results) {
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body).toEqual({ status: 'ok' });
    }
  });
});

describe('Static file serving', () => {
  it('serves the Storybook index page at /', async () => {
    const res = await fetch(`${BASE_URL}/`);

    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain('<html');
  });

  it('returns 404 for unknown paths', async () => {
    const res = await fetch(`${BASE_URL}/nonexistent-path-abc123`);
    expect(res.status).toBe(404);
  });
});
