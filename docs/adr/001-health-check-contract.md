# ADR 001: Standard health check endpoint contract for GraphRapids services

## Status

Accepted

## Context

Graphras needs a reliable, uniform way to determine when a service is ready before
running integration tests against it. A consistent health check contract across all
GraphRapids repositories avoids per-repo special-casing in orchestration logic.

## Decision

Every GraphRapids service **MUST** expose a `GET /health` endpoint that:

- Returns HTTP `200` with JSON body `{"status":"ok"}` when healthy.
- Returns HTTP `503` with JSON body `{"status":"unhealthy"}` when not ready
  (e.g. a required database is unavailable).
- Requires **no** authentication.
- Performs **no** business logic.
- If the service has a database or external dependency, verifies connectivity
  before returning `200`.

This endpoint is the sole readiness signal that Graphras and Docker healthchecks
rely on.

## Consequences

- Graphras can use a uniform readiness probe across all services.
- Dockerfile `HEALTHCHECK` instructions and docker-compose healthchecks share the
  same probe target.
- Any change to the path (`/health`) or response shape (`{"status":"ok"}`) must be
  coordinated across **all** GraphRapids repositories and the Graphras orchestration
  layer.
