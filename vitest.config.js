import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    exclude: [
      'node_modules/**',
      'e2e/**',
      'tests/integration/**',
    ],
    reporters: ['default'],
    coverage: {
      provider: 'v8',
      include: ['src/components/**'],
      thresholds: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },
  },
});
