# ADR 002: Dockerfile and Docker Compose Conventions

## Status

Accepted

## Context

To enable pre-push integration testing via Graphras, each GraphRapids repository
needs a containerized runtime. Consistent conventions reduce cognitive overhead
and allow shared tooling.

## Decision

1. **Multi-stage build:** Every Dockerfile MUST use at least two stages — a
   build stage and a slim runtime stage.
2. **Non-root user:** The runtime stage MUST create and switch to a non-root
   user.
3. **No secrets:** Dockerfiles and docker-compose files MUST NOT contain
   secrets. Use environment variables with safe defaults.
4. **EXPOSE:** Each Dockerfile MUST include an `EXPOSE` instruction documenting
   the service port.
5. **HEALTHCHECK:** Each Dockerfile MUST include a `HEALTHCHECK` instruction
   targeting `GET /health`.
6. **Port convention:** Services use non-privileged ports (≥ 1024). Assigned
   ports:
   - GraphView: `8080`
   - GraphAPI: `8081` (reserved)
   - GraphLoom: `8082` (reserved)
   - GraphYamlEditor: `8083` (reserved)
7. **docker-compose.yml:** Must define a dedicated bridge network for isolation
   and include a `healthcheck` block.

## Consequences

- All repos follow the same Docker patterns, making it easy to template new
  services.
- Port assignments prevent collisions when running multiple services
  simultaneously.
- The non-root requirement improves security posture of deployed containers.
