# ADR 003: Integration test scaffolding and execution conventions

## Status

Accepted

## Context

Graphras will run integration tests against live service instances before pushing
PRs to GitHub. A consistent test structure and execution model across repositories
is required.

## Decision

1. Integration tests **MUST** live in `tests/integration/`.
2. They **MUST** be runnable via a dedicated command (e.g.
   `npm run test:integration`) that is **separate** from the unit test command.
3. The default test command (`npm test`) **MUST NOT** execute integration tests.
4. File naming convention: `*.integration.{js,mjs}` — this avoids matching the
   default vitest include pattern (`*.{test,spec}.*`).
5. Each test **MUST** be self-contained: set up its own data, assert, and clean up.
   No shared mutable state between tests.
6. Tests **MUST** include a readiness check that waits for the `/health` endpoint
   with exponential back-off before running.
7. The service URL **MUST** be configurable via an environment variable
   (e.g. `GRAPHVIEW_URL`, `GRAPHAPI_URL`).
8. Recommended timeouts: 30 s per test, 60 s for setup hooks.

## Consequences

- Integration tests can run locally against `docker-compose` or in CI against
  deployed services.
- No shared mutable state reduces flakiness.
- Consistent directory and command naming simplifies Graphras orchestration across
  all GraphRapids repositories.
