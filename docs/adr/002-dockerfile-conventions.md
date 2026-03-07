# ADR 002: Dockerfile and docker-compose conventions for GraphRapids repositories

## Status

Accepted

## Context

GraphRapids repositories need consistent containerisation patterns for local
development, Graphras integration validation, and eventual deployment.

## Decision

1. Every repository **MUST** have a `Dockerfile` at the repo root using a
   **multi-stage build** (build stage + slim runtime stage).
2. The runtime stage **MUST** use a non-root user.
3. The Dockerfile **MUST** include an `EXPOSE` instruction documenting the service
   port.
4. The Dockerfile **MUST** include a `HEALTHCHECK` instruction targeting
   `GET /health`.
5. Port assignments (host-side defaults):
   | Service          | Port |
   |------------------|------|
   | GraphView        | 8080 |
   | GraphAPI         | 8081 |
   | GraphLoom        | 8082 |
   | GraphYamlEditor  | 8083 |
6. `docker-compose.yml` **MUST** define a `graphrapids` bridge network for service
   isolation.
7. **No** secrets, credentials, or tokens in Dockerfiles or compose files. Use
   environment variables with sensible defaults.
8. A `.dockerignore` **MUST** be present to exclude build artefacts, `node_modules`,
   `.git`, etc.

## Consequences

- Consistent structure simplifies Graphras orchestration.
- Port convention prevents collisions when running multiple services simultaneously.
- New repositories can copy the pattern from GraphView as a template.
