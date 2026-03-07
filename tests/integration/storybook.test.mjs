/**
 * Integration tests — Storybook serving.
 *
 * Verifies that the containerised Storybook instance serves
 * pages correctly and that the GraphView story is accessible.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

const BASE_URL = process.env.GRAPHVIEW_URL || 'http://localhost:8081';

describe('Storybook integration', () => {
  it('serves the Storybook index page', async () => {
    const res = await fetch(`${BASE_URL}/`);
    assert.equal(res.status, 200);

    const html = await res.text();
    assert.ok(
      html.includes('<!DOCTYPE html') || html.includes('<html'),
      'Expected an HTML document from the Storybook root',
    );
  });

  it('serves the iframe.html entry for stories', async () => {
    const res = await fetch(`${BASE_URL}/iframe.html`);
    assert.equal(res.status, 200);

    const contentType = res.headers.get('content-type');
    assert.ok(
      contentType && contentType.includes('text/html'),
      `Expected text/html content-type, got ${contentType}`,
    );
  });

  it('serves the GraphView rendered story via query params', async () => {
    const url = `${BASE_URL}/iframe.html?id=components-graphview--rendered&viewMode=story`;
    const res = await fetch(url);
    assert.equal(res.status, 200);
  });
});
