import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://stg.nas-internal.com/login');
  await page.getByRole('textbox', { name: 'ID Pengguna' }).click();
  await page.getByRole('textbox', { name: 'ID Pengguna' }).fill('rosnizamusa');
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).click();
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).fill('Password123@');
  await page.getByRole('button', { name: 'Log Masuk', exact: true }).click();
  await page.getByRole('button', { name: 'Pendaftaran Pantas Pukal' }).click();
  await page.locator('a').filter({ hasText: 'Bantuan Pantas' }).click();
  await page.getByRole('button', { name: 'Permohonan pukal' }).first().click();
  await page.getByRole('button', { name: 'Mohon Bantuan' }).click();
  await page.getByRole('button', { name: 'Padam' }).first().click();
  await page.getByRole('button', { name: 'Ya, Padam' }).click();
  await page.getByRole('button', { name: 'Kemas kini bantuan' }).click();
  await page.getByRole('button', { name: 'Hantar (0)' }).click();
  await page.getByRole('button', { name: 'Ya, Hantar' }).click();
  await page.goto('https://stg.nas-internal.com/profiling/asnaf/pendaftaran-pantas-pukal/permohonan?bencanaId=b4df65e5-c2ba-11f1-b888-0638b6866fa5');
});