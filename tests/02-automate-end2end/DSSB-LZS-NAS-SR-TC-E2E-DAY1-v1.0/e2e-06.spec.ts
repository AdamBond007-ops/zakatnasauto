import { test, expect, type Locator, type Page } from '@playwright/test';
import { join } from 'path';

async function uploadFile(page: Page, pilihFailButton: Locator): Promise<void> {
  const [fileChooser] = await Promise.all([
    page.waitForEvent('filechooser'),
    pilihFailButton.click(),
  ]);
  await fileChooser.setFiles(join(__dirname, 'a1d1557c58e82554ca7226f90e349f39.jpg'));
}

test('test', async ({ page }) => {
  await page.goto('https://stg.nas-internal.com/login');
  await page.getByRole('textbox', { name: 'ID Pengguna' }).click();
  await page.getByRole('textbox', { name: 'ID Pengguna' }).fill('abdwalid');
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).click();
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).fill('Password123@');
  await page.getByRole('button', { name: 'Log Masuk', exact: true }).click();
  await page.locator('a').filter({ hasText: 'Carian Asnaf' }).click();
  await page.getByRole('textbox', { name: 'Nama', exact: true }).click();
  await page.getByRole('textbox', { name: 'Nama', exact: true }).fill('END AUTo');
  await page.getByRole('button', { name: 'Cari' }).click();
  await page.getByRole('button', { name: 'Lihat Profil' }).first().click();
  await page.getByRole('button', { name: 'Kemaskini' }).click();
  await page.waitForTimeout(3000);
  await page.getByText('Daftar / Kemaskini /').click();
  await page.getByText('Pendaftaran baharu atau').click();
  await uploadFile(page, page.getByRole('button', { name: 'Pilih Fail' }));
  await page.getByRole('textbox', { name: 'Pernyataan Masalah*' }).click();
  await page.getByRole('textbox', { name: 'Pernyataan Masalah*' }).fill('masalah');
  await page.getByRole('button', { name: 'Seterusnya', exact: true }).click();
  await page.getByRole('textbox', { name: 'Tempat Lahir Update Without' }).click();
  await page.getByRole('textbox', { name: 'Tempat Lahir Update Without' }).fill('PUCHCHCHCh');
  await page.getByRole('button', { name: 'Seterusnya' }).click();
  await page.getByRole('button', { name: 'Seterusnya' }).click();
  await page.getByRole('button', { name: 'Seterusnya' }).click();
  await page.getByRole('button', { name: 'Selesai', exact: true }).click();
  await page.getByRole('button', { name: 'Seterusnya' }).click();
  await page.getByRole('button', { name: 'Seterusnya' }).click();
  await page.getByRole('button', { name: 'Seterusnya' }).click();
  await page.getByRole('button', { name: 'Pengesahan Akhir Belum' }).click();
  await page.getByRole('radio', { name: 'Tidak Memerlukan Tanda tangan' }).check();
  await page.getByRole('button', { name: 'Hantar Permohonan' }).click();
  await page.getByRole('button', { name: 'Ya, Hantar' }).click();
  await page.getByRole('button', { name: 'OK' }).click();
});