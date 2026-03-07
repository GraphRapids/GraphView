import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      'tests/integration/**',
    ],
    coverage: {
      provider: 'v8',
    },
  },
});
