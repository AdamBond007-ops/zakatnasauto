import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://stg.nas-internal.com/login');
  await page.getByRole('textbox', { name: 'ID Pengguna' }).click();
  await page.getByRole('textbox', { name: 'ID Pengguna' }).fill('m.sharil');
  await page.locator('div:nth-child(2) > .formkit-wrapper > .formkit-inner').click();
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).fill('Password123@');
  await page.getByRole('button', { name: 'Log Masuk', exact: true }).click();
  await page.locator('a').filter({ hasText: 'Laporan' }).nth(1).click();
  await page.getByRole('button', { name: 'Organisasi' }).click();
});