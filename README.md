# GraphView

[![License: Apache-2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](./LICENSE)
[![CI](https://github.com/GraphRapids/GraphView/actions/workflows/ci.yml/badge.svg)](https://github.com/GraphRapids/GraphView/actions/workflows/ci.yml)

GraphView is a graph visualization component library built with Storybook.

## Getting Started

```bash
npm install
npm run build
npm test
```

## Docker

### Build and run

```bash
docker compose up --build -d
```

The Storybook UI is served at **http://localhost:8081**.

### Health check

```bash
curl http://localhost:8081/health
# → {"status":"ok"}
```

### Integration tests

Requires a running service (Docker or manual):

```bash
npm run test:integration
```

## Static File Server (`server.mjs`)

A minimal Node.js HTTP server that serves the `storybook-static/` build output.

| Feature | Detail |
|---|---|
| **Port** | `8081` (override via `PORT` env var) |
| **Health endpoint** | `GET /health` → `{"status":"ok"}` |
| **Allowed methods** | `GET`, `HEAD` only; all others receive `405 Method Not Allowed` with `Allow: GET, HEAD` header |
| **Path traversal protection** | Resolved paths are validated with a trailing path-separator check (`resolvedPath.startsWith(root + sep)`) to prevent prefix-collision bypasses |
| **Error format** | All error responses are JSON (e.g. `{"error":"Not Found"}`) |

### Exports

`server.mjs` exports `server`, `STATIC_ROOT`, and `PORT` for programmatic use (e.g. in integration test setup).

### Security notes

- The server is designed for serving static Storybook assets only.
- No rate limiting or request-size limits are applied; do not expose to untrusted networks without a reverse proxy.
- Non-GET/HEAD requests are rejected at the top of the request handler before any file-system access.

## Ports

| Service | Port |
|---|---|
| GraphView (Storybook) | 8081 |

Future GraphRapids services should use distinct ports (8082, 8083, etc.).

## License

Apache-2.0 — see [LICENSE](./LICENSE).
