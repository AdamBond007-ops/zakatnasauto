import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://stg.nas-internal.com/pengurusan-tunai/laporan/baki-semasa-tabung');
  await page.getByRole('textbox', { name: 'ID Pengguna' }).click();
  await page.getByRole('textbox', { name: 'ID Pengguna' }).fill('m.sharil');
  await page.getByRole('textbox', { name: 'ID Pengguna' }).press('Tab');
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).fill('Password123@');

  await page.getByRole('button', { name: 'Log Masuk', exact: true }).click();
  await page.waitForTimeout(2000);
  await page.locator('a').nth(4).click();
  await page.getByRole('button', { name: 'Lihat', description: 'Lihat' }).click();
  await page.getByRole('button', { name: 'Lihat', description: 'Lihat' }).click();
});