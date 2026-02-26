# GraphView - Project Context

## Purpose
GraphView is a reusable React component package that renders graph SVG previews with pan/zoom controls and safe rendering defaults.

## Primary Goals
- Provide a clean, reusable viewer component for GraphRapids apps.
- Keep rendering safe by avoiding direct unsanitized SVG injection.
- Offer strong UX defaults: status, errors, fit, theme toggle, download.

## Package Snapshot
- Package name: `@graphrapids/graph-view`
- Source: `src/components/GraphView/GraphView.jsx`
- Entry points:
  - `src/index.js`
  - `src/components/GraphView/index.js`
- Build output:
  - `dist/index.js`
  - `dist/index.js.map`

## Consumer Contract
Main props accepted by `GraphView`:
- `svgText`
- `status`
- `errors`
- `theme`
- `onToggleTheme`
- `profileId`
- `profileVersion`
- `profileStage`
- `profileChecksum`

Behavior expectations:
- Show status/errors without breaking viewer rendering.
- Keep pan/zoom interactions responsive.
- Support fit-to-view patterns expected by GraphEditor.

## Safety Rules
- Prefer blob/object URL rendering of SVG text.
- Do not require consumers to use `dangerouslySetInnerHTML`.
- Treat API-provided SVG as untrusted input.

## Testing Expectations
- Unit tests (Vitest + Testing Library): `npm run test`
- Build validation: `npm run build`
- Packaging: `npm pack`

## Integration Notes
GraphEditor currently consumes local tarball builds:
- `file:../GraphView/graphrapids-graph-view-0.1.0.tgz`

After GraphView changes:
1. `npm run build`
2. `npm pack`
3. Reinstall package in consumer app(s)

## Open Decisions / TODO
- [ ] Add prop-level docs table in README for all supported inputs.
- [ ] Add visual regression coverage for theme and error variants.
- [ ] Decide semantic versioning workflow for releases beyond local tarballs.

## How To Maintain This File
- Update this file whenever public API, behavior, or architecture changes.
- Keep details implementation-accurate and linked to concrete files.
