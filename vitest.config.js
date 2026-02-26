import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
    exclude: [...configDefaults.exclude, 'e2e/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/components/GraphView/GraphView.jsx'],
      thresholds: {
        lines: 60,
        functions: 60,
        branches: 45,
        statements: 60
      }
    }
  }
});
