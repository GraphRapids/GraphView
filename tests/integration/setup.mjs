/**
 * Readiness gate for integration tests.
 *
 * Waits for the GraphView service health endpoint to return HTTP 200
 * with {"status":"ok"} before allowing tests to proceed.  Uses
 * exponential back-off with a hard 30-second timeout.
 *
 * Usage (standalone):  node tests/integration/setup.mjs
 *
 * Environment variables:
 *   GRAPHVIEW_URL  — base URL of the running service
 *                    (default: http://localhost:8081)
 */

const BASE_URL = process.env.GRAPHVIEW_URL || 'http://localhost:8081';
const TIMEOUT_MS = 30_000;

async function waitForReady() {
  const start = Date.now();
  let interval = 500;

  while (Date.now() - start < TIMEOUT_MS) {
    try {
      const res = await fetch(`${BASE_URL}/health`);
      if (res.ok) {
        const body = await res.json();
        if (body.status === 'ok') {
          console.log(`\u2713 Service ready at ${BASE_URL}`);
          return;
        }
      }
    } catch {
      // Service not reachable yet — retry.
    }
    await new Promise((resolve) => setTimeout(resolve, interval));
    interval = Math.min(Math.round(interval * 1.5), 5_000);
  }

  console.error(
    `\u2717 Service at ${BASE_URL} did not become ready within ${TIMEOUT_MS} ms`,
  );
  process.exit(1);
}

await waitForReady();
