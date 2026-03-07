import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';

const BASE_URL = process.env.GRAPHVIEW_URL || 'http://localhost:6006';
const READY_TIMEOUT_MS = 30_000;
const INITIAL_RETRY_MS = 500;
const MAX_RETRY_MS = 4_000;

/**
 * Wait for the service health endpoint to return 200.
 * Uses exponential backoff with a cap.
 */
async function waitForReady() {
  const deadline = Date.now() + READY_TIMEOUT_MS;
  let delay = INITIAL_RETRY_MS;
  let lastError;

  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${BASE_URL}/health`);
      if (res.status === 200) {
        return;
      }
      lastError = new Error(`Health check returned status ${res.status}`);
    } catch (err) {
      lastError = err;
    }
    await new Promise((resolve) => setTimeout(resolve, delay));
    delay = Math.min(delay * 2, MAX_RETRY_MS);
  }
  throw new Error(
    `Service at ${BASE_URL} not ready after ${READY_TIMEOUT_MS}ms: ${lastError?.message}`,
  );
}

describe('GraphView Integration Tests', () => {
  before(async () => {
    await waitForReady();
  });

  // ------------------------------------------------------------------
  // Health Check
  // ------------------------------------------------------------------
  describe('Health Check', () => {
    it('GET /health returns 200 with { status: "ok" }', async () => {
      const res = await fetch(`${BASE_URL}/health`);
      assert.equal(res.status, 200);
      const body = await res.json();
      assert.deepStrictEqual(body, { status: 'ok' });
    });

    it('GET /health returns application/json content-type', async () => {
      const res = await fetch(`${BASE_URL}/health`);
      const ct = res.headers.get('content-type');
      assert.match(ct, /application\/json/);
    });

    it('GET /health includes security headers', async () => {
      const res = await fetch(`${BASE_URL}/health`);
      assert.equal(res.headers.get('x-content-type-options'), 'nosniff');
      assert.equal(res.headers.get('x-frame-options'), 'DENY');
      assert.equal(res.headers.get('x-xss-protection'), '1; mode=block');
      assert.ok(res.headers.get('referrer-policy'));
      assert.ok(res.headers.get('content-security-policy'));
    });
  });

  // ------------------------------------------------------------------
  // Static File Serving
  // ------------------------------------------------------------------
  describe('Static File Serving', () => {
    it('GET / returns the Storybook index page', async () => {
      const res = await fetch(`${BASE_URL}/`);
      assert.equal(res.status, 200);
      const ct = res.headers.get('content-type');
      assert.match(ct, /text\/html/);
    });

    it('GET /nonexistent-path returns 404', async () => {
      const res = await fetch(`${BASE_URL}/nonexistent-path-xyz-12345`);
      assert.equal(res.status, 404);
    });
  });

  // ------------------------------------------------------------------
  // Security
  // ------------------------------------------------------------------
  describe('Security', () => {
    it('rejects requests with percent-encoded null bytes', async () => {
      const res = await fetch(`${BASE_URL}/foo%00bar`);
      assert.equal(res.status, 400);
    });

    it('rejects directory traversal via percent-encoded dots', async () => {
      const res = await fetch(`${BASE_URL}/%2e%2e/etc/passwd`);
      assert.equal(res.status, 403);
    });

    it('rejects non-GET/HEAD methods', async () => {
      const res = await fetch(`${BASE_URL}/health`, { method: 'POST' });
      assert.equal(res.status, 405);
    });

    it('rejects malformed percent-encoding', async () => {
      // %ZZ is not valid percent-encoding
      const res = await fetch(`${BASE_URL}/%ZZ`);
      assert.equal(res.status, 400);
    });
  });
});
