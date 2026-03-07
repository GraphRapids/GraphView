/**
 * Integration test setup — waits for the GraphView service to become ready.
 *
 * Configure the service URL via the GRAPHVIEW_URL environment variable.
 * Default: http://localhost:8080
 */

export const BASE_URL = process.env.GRAPHVIEW_URL || 'http://localhost:8080';

const MAX_RETRIES = 10;
const INITIAL_DELAY_MS = 500;

/**
 * Poll the /health endpoint with exponential backoff until the service
 * reports healthy or the retry budget is exhausted (~30 s).
 */
export async function waitForService() {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(`${BASE_URL}/health`);
      if (res.ok) {
        const body = await res.json();
        if (body.status === 'ok') return;
      }
    } catch {
      // Service not ready yet — retry
    }
    const delay = INITIAL_DELAY_MS * Math.pow(2, attempt);
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
  throw new Error(
    `Service at ${BASE_URL} did not become ready after ${MAX_RETRIES} attempts`,
  );
}
