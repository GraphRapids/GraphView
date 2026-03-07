# ADR 001: Standard Health Check Endpoint Contract

## Status

Accepted

## Context

GraphRapids services need a consistent health check mechanism so that Graphras
(the orchestration agent) can determine when a service is ready before running
integration tests. Without a standard contract, each repo would implement health
checks differently, making orchestration brittle.

## Decision

All GraphRapids services MUST expose a `GET /health` endpoint that:

- Returns HTTP `200` with `Content-Type: application/json` and body
  `{"status":"ok"}` when the service is healthy and ready to accept requests.
- Returns HTTP `503` if the service is running but not ready (e.g., pending
  database connection).
- Requires no authentication.
- Performs no business logic beyond readiness verification.

## Consequences

- Graphras can use a single polling strategy across all repos.
- Dockerfiles can use a uniform `HEALTHCHECK` instruction.
- Any change to this contract must be coordinated across all repos and Graphras
  simultaneously.
