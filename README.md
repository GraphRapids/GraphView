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
e2e/graphview.scaffold.spec.ts
tests/integration/setup.mjs
tests/integration/health.test.mjs
tests/integration/storybook.test.mjs
playwright.config.ts
scripts/build.mjs
vitest.config.js
Dockerfile
docker-compose.yml
server.mjs
.storybook/
.github/workflows/
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

GraphView can be built and served as a containerised Storybook instance for
integration testing and visual review.

### Exposed Port

| Service   | Port |
|-----------|------|
| GraphView | 8081 |

### Build the Docker Image

```bash
docker build -t graphrapids/graph-view .
```

### Run with Docker

```bash
docker run -p 8081:8081 graphrapids/graph-view
```

The service exposes a health check at `GET /health` that returns:

```json
{ "status": "ok" }
```

### Run with Docker Compose

```bash
docker compose up --build
```

This starts the GraphView service on port **8081** with a health check.
The service is considered ready when `GET /health` returns HTTP 200.

## Integration Tests

Integration tests run against a **live instance** of the service and are
separate from unit tests — they are **not** executed by `npm test`.

### Prerequisites

Start the service first:

```bash
docker compose up --build -d
```

### Run Integration Tests

```bash
npm run test:integration
```

The test runner waits for the `/health` endpoint to become available
(with exponential back-off, 30 s timeout) before executing tests.

Override the service URL via the `GRAPHVIEW_URL` environment variable:

```bash
GRAPHVIEW_URL=http://localhost:8081 npm run test:integration
```

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

## Persistent Context

- `PROJECT_CONTEXT.md` holds stable package architecture and API notes.
- `SESSION_NOTES.md` is the running implementation handoff log between sessions.

## Acknowledgements

- [React](https://react.dev/)
- [react-svg-pan-zoom](https://github.com/chrvadala/react-svg-pan-zoom)
- GraphRapids maintainers and contributors

## License

Apache-2.0 (`LICENSE`).
