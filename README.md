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
tests/integration/health.integration.mjs
tests/integration/vitest.config.mjs
e2e/graphview.scaffold.spec.ts
playwright.config.ts
scripts/build.mjs
scripts/serve.mjs
vitest.config.js
Dockerfile
docker-compose.yml
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

GraphView is containerised as a static Storybook server with a `/health` endpoint.

### Exposed Port

| Service    | Port |
|------------|------|
| GraphView  | 8080 |

### Build and Run with Docker

```bash
# Build the image
docker build -t graphview .

# Run the container
docker run -p 8080:8080 graphview

# Verify health
curl http://localhost:8080/health
# {"status":"ok"}
```

### Run with docker-compose

```bash
# Start the service (builds if needed)
docker compose up --build -d

# Wait for healthy status
docker compose ps

# Stop and remove
docker compose down
```

The `GRAPHVIEW_PORT` environment variable overrides the host-side port mapping (default: `8080`).

### Local Static Server (without Docker)

```bash
npm run build-storybook
npm run serve
# Listening on http://0.0.0.0:8080
```

## Integration Tests

Integration tests run against a live GraphView instance and are kept separate from unit tests.

```bash
# 1. Start the service (Docker or local)
docker compose up --build -d

# 2. Run integration tests
npm run test:integration

# 3. Tear down
docker compose down
```

The `GRAPHVIEW_URL` environment variable overrides the target URL (default: `http://localhost:8080`).

Integration tests live in `tests/integration/` and use the `*.integration.mjs` naming convention so they are never executed by `npm test`.

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

## Architecture Decision Records

- [ADR 001: Health check endpoint contract](docs/adr/001-health-check-contract.md)
- [ADR 002: Dockerfile and docker-compose conventions](docs/adr/002-dockerfile-conventions.md)
- [ADR 003: Integration test conventions](docs/adr/003-integration-test-conventions.md)

## Acknowledgements

- [React](https://react.dev/)
- [react-svg-pan-zoom](https://github.com/chrvadala/react-svg-pan-zoom)
- GraphRapids maintainers and contributors

## License

Apache-2.0 (`LICENSE`).
