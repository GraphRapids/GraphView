import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    exclude: [...configDefaults.exclude, 'tests/integration/**'],
    coverage: {
      provider: 'v8',
      include: ['src/**'],
      thresholds: {
        statements: 60,
        branches: 60,
        functions: 45,
        lines: 60,
      },
    },
  },
});
