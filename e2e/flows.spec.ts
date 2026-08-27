import { test, expect } from '@playwright/test';

test.describe('SiKaya Key Flows', () => {
  test('homepage loads correctly', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/SiKaya/);
    await expect(page.getByText('SiKaya', { exact: false }).first()).toBeVisible();
  });

  test('404 page loads correctly for unknown route', async ({ page }) => {
    const res = await page.goto('/halaman-tidak-ditemukan');
    await expect(page.getByText(/404|Tidak Ditemukan/i)).toBeVisible();
  });
});
