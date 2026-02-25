# Third-Party Notices

Last verified: 2026-02-25

GraphView is licensed under Apache-2.0. This file documents third-party software and tools used by the project.

## Runtime dependencies

| Component | How GraphView uses it | License | Source |
| --- | --- | --- | --- |
| `react` | Component runtime | MIT | https://github.com/facebook/react |
| `react-dom` | Browser and test rendering | MIT | https://github.com/facebook/react |
| `react-svg-pan-zoom` | Interactive SVG pan/zoom viewer | MIT | https://github.com/chrvadala/react-svg-pan-zoom |

## Build and development tooling (not redistributed)

| Component | How GraphView uses it | License | Source |
| --- | --- | --- | --- |
| `esbuild` | Bundling package output to `dist/` | MIT | https://github.com/evanw/esbuild |
| `vitest` | Unit test runner | MIT | https://github.com/vitest-dev/vitest |
| `@testing-library/react` | React component tests | MIT | https://github.com/testing-library/react-testing-library |
| `@testing-library/jest-dom` | DOM assertions for tests | MIT | https://github.com/testing-library/jest-dom |
| `jsdom` | Browser-like DOM in Node test runtime | MIT | https://github.com/jsdom/jsdom |

## Downstream obligations

- Verify transitive dependency licenses before redistribution.
- Keep this file updated as dependencies/tooling change.
