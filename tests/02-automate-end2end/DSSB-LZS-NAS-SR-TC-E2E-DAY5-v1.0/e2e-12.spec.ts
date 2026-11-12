import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://stg.nas-internal.com/login');
  await page.getByRole('textbox', { name: 'ID Pengguna' }).click();
  await page.getByRole('textbox', { name: 'ID Pengguna' }).fill('zakatselm.nazri');
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).click();
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).fill('Password123@');
  await page.getByRole('button', { name: 'Log Masuk', exact: true }).click();
  await page.getByRole('button', { name: 'Tukar Peranan' }).click();
  await page.locator('button[role="menuitem"]', { hasText: 'KEWANGAN' }).click();
  await page.locator('a').nth(4).click();
  await page.getByRole('button', { name: 'Tukar Peranan' }).click();
  await page.locator('.inline-flex.items-center.justify-center.w-8').first().click();
});