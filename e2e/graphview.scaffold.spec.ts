import { expect, test } from '@playwright/test';

test('storybook scaffold renders GraphView story', async ({ page }) => {
  await page.goto('/iframe.html?id=components-graphview--rendered&viewMode=story');
  await expect(page.getByRole('heading', { name: 'SVG Preview' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Download SVG' })).toBeVisible();
});

test.skip('GraphView pan/zoom interaction scenarios are pending specification', async () => {
  // Intentionally scaffolded. Behavior tests will be added once scenarios are finalized.
});
