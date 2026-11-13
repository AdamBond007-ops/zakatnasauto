import { test, expect, type Locator } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { join } from 'path';

async function uploadFile(fileInput: Locator): Promise<void> {
  await fileInput.setInputFiles(join(__dirname, 'a1d1557c58e82554ca7226f90e349f39.jpg'));
}

test('test', async ({ page }) => {
 
   await page.goto('https://stg.nas-internal.com/login');
 await page.getByRole('textbox', { name: 'ID Pengguna' }).click();
  await page.getByRole('textbox', { name: 'ID Pengguna' }).fill('abdwalid');
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).click();
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).fill('Password123@');
  await page.getByRole('button', { name: 'Log Masuk', exact: true }).click();
  await page.getByRole('button', { name: 'Tuntutan' }).click();
  await page.locator('a').filter({ hasText: 'Senarai Tuntutan' }).click();
  await page.locator('a').filter({ hasText: 'Pengurusan Tuntutan' }).click();
  await page.waitForTimeout(3000);
  await page.getByRole('searchbox', { name: 'Cari...' }).click();
  await page.getByRole('searchbox', { name: 'Cari...' }).fill('kaxxx');
  await page.getByRole('button', { name: 'Mohon Tuntutan' }).first().click();
  await page.getByRole('textbox', { name: 'No. Invoice Customer*' }).click();
  await page.getByRole('textbox', { name: 'No. Invoice Customer*' }).fill(faker.string.numeric(8));
  await page.getByRole('textbox', { name: 'Amaun Tuntutan (RM)*' }).click();
  await page.getByRole('textbox', { name: 'Amaun Tuntutan (RM)*' }).fill('200');
  await page.getByRole('textbox', { name: 'Catatan*' }).click();
  await page.getByRole('textbox', { name: 'Catatan*' }).fill('catatan');
  await page.getByRole('button', { name: 'Muat Naik Dokumen' }).click();
  await uploadFile(page.locator('input[type="file"]').first());
  await page.getByRole('textbox', { name: 'Tarikh Invoice Customer*' }).fill('2026-11-05');
  await page.getByRole('button', { name: 'Hantar' }).click();
  await page.getByRole('button', { name: 'Ya, Hantar' }).click();
  await page.getByRole('button', { name: 'Log Keluar' }).click();


  //KJPSK
  await page.getByRole('textbox', { name: 'ID Pengguna' }).click();
  await page.getByRole('textbox', { name: 'ID Pengguna' }).fill('fadhli');
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).click();
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).fill('Password123@');
  await page.getByRole('button', { name: 'Log Masuk', exact: true }).click();
  await page.getByRole('button', { name: 'Tuntutan' }).click();
  await page.locator('a').filter({ hasText: 'Senarai Kelulusan' }).click();
  await page.getByRole('searchbox', { name: 'Cari...' }).click();
  await page.getByRole('searchbox', { name: 'Cari...' }).fill('kaxxx');
  await page.waitForTimeout(5000);

  await page.getByRole('button', { name: 'Lihat' }).click();
  await page.getByRole('table').getByText('Sila Pilih', { exact: true }).click();
  await page.locator('span').filter({ hasText: 'Lengkap' }).first().click();
  await page.getByText('Sila Pilih', { exact: true }).click();
  await page.locator('span').filter({ hasText: 'Lulus' }).nth(1).click();
  await page.getByRole('textbox', { name: 'Catatan*' }).click();
  await page.getByRole('textbox', { name: 'Catatan*' }).fill('Lulus');
  await page.getByRole('button', { name: 'Hantar' }).click();
  await page.getByRole('button', { name: 'Ya, Hantar' }).click();
  await page.getByRole('button', { name: 'Log Keluar' }).click();

  });