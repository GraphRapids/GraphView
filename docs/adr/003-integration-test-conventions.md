# ADR 003: Integration Test Scaffolding and Execution Conventions

## Status

Accepted

## Context

Graphras needs to run integration tests against live service instances before
pushing PRs. A consistent structure across repos simplifies orchestration.

## Decision

1. **Directory:** Integration tests live in `tests/integration/`.
2. **Independent execution:** Integration tests MUST be runnable via a dedicated
   command (`npm run test:integration`) and MUST NOT be executed by the default
   test command (`npm test`).
3. **Self-contained:** Each test sets up its own data, asserts, and tears down.
   No shared mutable state between tests. No reliance on pre-seeded data.
4. **Service readiness:** Test setup MUST wait for the service health endpoint
   with retry and exponential backoff (max ~30 s timeout).
5. **Environment:** The service base URL is configurable via an environment
   variable (e.g., `GRAPHVIEW_URL`), defaulting to
   `http://localhost:<assigned-port>`.

## Consequences

- Graphras can discover and run integration tests uniformly across all repos.
- Tests are resilient to container startup timing variations.
- The self-contained requirement prevents flaky inter-test dependencies.
