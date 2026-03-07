/**
 * Integration tests — GET /health endpoint.
 *
 * Verifies the Graphras cross-repo health check contract:
 *   GET /health  →  200  {"status":"ok"}
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

const BASE_URL = process.env.GRAPHVIEW_URL || 'http://localhost:8081';

describe('GET /health', () => {
  it('returns HTTP 200 with JSON body { status: "ok" }', async () => {
    const res = await fetch(`${BASE_URL}/health`);

    assert.equal(res.status, 200);

    const contentType = res.headers.get('content-type');
    assert.ok(
      contentType && contentType.includes('application/json'),
      `Expected application/json content-type, got ${contentType}`,
    );

    const body = await res.json();
    assert.deepStrictEqual(body, { status: 'ok' });
  });
});
