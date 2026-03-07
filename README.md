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
tests/integration/healthcheck.test.mjs
server.mjs
Dockerfile
docker-compose.yml
playwright.config.ts
scripts/build.mjs
vitest.config.js
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

GraphView is containerised via a multi-stage Dockerfile that builds Storybook
and serves it with a minimal Node.js static file server.

**Exposed port:** `6006` (configurable via the `PORT` environment variable)

### Build the image

```bash
docker build -t graphview .
```

### Run the container

```bash
docker run -p 6006:6006 graphview
```

### Using docker-compose

```bash
docker compose up --build
```

The service will be available at `http://localhost:6006`. The health check
endpoint is at `GET /health` and returns `{"status":"ok"}` with HTTP 200.

### Serving locally (without Docker)

Build Storybook and start the production server:

```bash
npm run build-storybook
npm run serve
```

## Integration Testing

Integration tests live in `tests/integration/` and run against a live instance
of the service. They are fully separated from unit tests.

### Run integration tests

1. Start the service (via Docker or locally):

   ```bash
   docker compose up --build -d
   # or
   npm run build-storybook && npm run serve &
   ```

2. Run the integration test suite:

   ```bash
   npm run test:integration
   ```

3. Optionally point tests at a different URL:

   ```bash
   GRAPHVIEW_URL=http://localhost:8080 npm run test:integration
   ```

The tests wait for the `/health` endpoint with exponential backoff (up to 30 s)
before executing.

## Health Check

| Endpoint | Method | Response | Status |
| --- | --- | --- | --- |
| `/health` | `GET` | `{"status":"ok"}` | `200` |

This is a cross-repo contract used by Graphras for pre-push integration
validation. Do not change the path or response shape without updating the
corresponding ADR.

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
