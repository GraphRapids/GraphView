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
- Profile metadata display (`profileId`, `profileVersion`, `profileStage`, `profileChecksum`)
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
