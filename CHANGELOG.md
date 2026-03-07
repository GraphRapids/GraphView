# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added
- `Dockerfile` — Multi-stage build producing a slim production image with `HEALTHCHECK` instruction.
- `docker-compose.yml` — Service definition on port 8081 with bridge network and health check.
- `server.mjs` — Lightweight Node.js static file server with `GET /health` endpoint for readiness probes.
- `tests/integration/` — Integration test suite with exponential back-off health-check wait (30 s timeout).
- `package.json` — `test:integration` script for running integration tests separately from unit tests.

### Fixed
- **Path traversal hardening** (`server.mjs`): Replaced bare `startsWith` guard with `resolvedChild.startsWith(resolvedParent + sep)` to prevent prefix-collision bypasses (e.g. `/storybook-static-evil` matching `/storybook-static`).
- **HTTP method restriction** (`server.mjs`): All routes now return `405 Method Not Allowed` with `Allow: GET, HEAD` header for non-GET/HEAD requests, per RFC 9110.

### Changed
- `server.mjs` — Error responses are now JSON (`application/json`) instead of plain text.
- `server.mjs` — MIME type for `.js`/`.mjs` changed from `text/javascript` to `application/javascript`.
- `server.mjs` — `STATIC_DIR` environment variable removed; static root is always `storybook-static` relative to the script.
- `server.mjs` — Exports `server`, `STATIC_ROOT`, and `PORT` for programmatic use in tests.
