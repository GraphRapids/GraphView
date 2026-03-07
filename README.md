# GraphView

[![License: Apache-2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](./LICENSE)
[![CI](https://github.com/GraphRapids/GraphView/actions/workflows/ci.yml/badge.svg)](https://github.com/GraphRapids/GraphView/actions/workflows/ci.yml)
[![Tests](https://github.com/GraphRapids/GraphView/actions/workflows/test.yml/badge.svg)](https://github.com/GraphRapids/GraphView/actions/workflows/test.yml)
[![Secret Scan](https://github.com/GraphRapids/GraphView/actions/workflows/gitleaks.yml/badge.svg)](https://github.com/GraphRapids/GraphView/actions/workflows/gitleaks.yml)

Reusable React SVG preview component package for GraphRapids apps.

## Package

- Name: `@graphrapids/graph-view`
- Entry export: `dist/index.js`
- Module format: ESM

## Features

- SVG preview pane with status and error display
- Runtime metadata display for graph/profile, theme, and icon-set resolution
- Interactive pan/zoom/fit via `react-svg-pan-zoom`
- Theme-aware SVG color-scheme transformation
- Secure blob URL rendering (no direct HTML injection)
- Built-in SVG download action

## Repository Layout

```text
src/index.js
src/components/GraphView/index.js
src/components/GraphView/GraphView.jsx
src/components/GraphView/GraphView.test.jsx
src/components/GraphView/GraphView.stories.jsx
src/test/setup.js
tests/integration/
e2e/graphview.scaffold.spec.ts
server.mjs
Dockerfile
docker-compose.yml
playwright.config.ts
scripts/build.mjs
vitest.config.js
vitest.integration.config.js
.storybook/
.github/workflows/
docs/adr/
```

## Development

```bash
npm install
npm run test
npm run test:e2e
npm run storybook
npm run build
npm pack
```

## Docker

GraphView is containerized as a static Storybook server with a health check endpoint.

**Exposed port:** `8080` (configurable via `PORT` environment variable)

### Build and run the Docker image

```bash
docker build -t graphrapids/graph-view .
docker run -p 8080:8080 graphrapids/graph-view
```

### Using docker-compose

```bash
docker compose up --build
```

This starts the GraphView service with health checking on an isolated Docker network (`graphview-net`).

### Health check

| Detail   | Value             |
|----------|-------------------|
| Endpoint | `GET /health`     |
| Status   | `200 OK`          |
| Body     | `{"status":"ok"}` |

### Integration tests

Integration tests run against a live service instance and are separate from unit tests:

```bash
# Start the service
docker compose up --build -d

# Wait for healthy, then run integration tests
npm run test:integration

# Tear down
docker compose down
```

The service URL defaults to `http://localhost:8080` and can be overridden with the `GRAPHVIEW_URL` environment variable.

## Use In GraphEditor

GraphEditor consumes local tarball builds:

```json
"@graphrapids/graph-view": "file:../GraphView/graphrapids-graph-view-0.1.0.tgz"
```

After changing GraphView:

1. `npm run build`
2. `npm pack`
3. In `GraphEditor` run:

```bash
npm install @graphrapids/graph-view@file:../GraphView/graphrapids-graph-view-0.1.0.tgz --force
```

## Governance

- `CONTRIBUTING.md`
- `SECURITY.md`
- `RELEASE.md`
- `THIRD_PARTY_NOTICES.md`

## Architecture Decision Records

- [`docs/adr/001-health-check-contract.md`](docs/adr/001-health-check-contract.md) — Standard health check endpoint contract
- [`docs/adr/002-dockerfile-conventions.md`](docs/adr/002-dockerfile-conventions.md) — Dockerfile and docker-compose conventions
- [`docs/adr/003-integration-test-conventions.md`](docs/adr/003-integration-test-conventions.md) — Integration test scaffolding and execution conventions

## Persistent Context

- `PROJECT_CONTEXT.md` holds stable package architecture and API notes.
- `SESSION_NOTES.md` is the running implementation handoff log between sessions.

## Acknowledgements

- [React](https://react.dev/)
- [react-svg-pan-zoom](https://github.com/chrvadala/react-svg-pan-zoom)
- GraphRapids maintainers and contributors

## License

Apache-2.0 (`LICENSE`).
