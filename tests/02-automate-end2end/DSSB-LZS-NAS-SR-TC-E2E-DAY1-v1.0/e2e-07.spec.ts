import { test, type Page } from '@playwright/test';
import { join } from 'path';
import { TIMEOUTS } from '../../library/1-data/config/timeout-config';
import { AduanAction } from '@library/2-object/Pendaftaran Lengkap/action';
import { STATUS_PEKERJAAN } from '@library/2-object/Pendaftaran Lengkap/data';

async function uploadFile(page: Page, buttonIndex: number): Promise<void> {
  const [fileChooser] = await Promise.all([
    page.waitForEvent('filechooser'),
    page.getByRole('button', { name: 'Pilih Fail' }).nth(buttonIndex).click(),
  ]);
  await fileChooser.setFiles(join(__dirname, 'a1d1557c58e82554ca7226f90e349f39.jpg'));
}

test('test', async ({ page }) => {
  const aduan = new AduanAction(page);

  //EKP 1
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
  await page.getByRole('button', { name: 'Ya, Kemaskini' }).click();
  await page.waitForTimeout(TIMEOUTS.SHORT);
  await page.locator('label').filter({ hasText: 'Daftar / Kemaskini /' }).click();
  await page.locator('label').filter({ hasText: 'Pendaftaran baharu atau' }).click();
  
  await uploadFile(page, 0);
  await page.getByRole('textbox', { name: 'Pernyataan Masalah*' }).click();
  await page.getByRole('textbox', { name: 'Pernyataan Masalah*' }).fill('masalah');
  await page.getByRole('button', { name: 'Seterusnya', exact: true }).click();
  await aduan.pilihMuflisDisenaraiHitam('Y');
  await page.getByRole('textbox', { name: 'Sebab Muflis/Disenarai Hitam' }).click();
  await page.getByRole('textbox', { name: 'Sebab Muflis/Disenarai Hitam' }).fill('SEBAb');
  await uploadFile(page, 2);
  await page.getByRole('button', { name: 'Simpan', exact: true }).click();
  await page.getByRole('button', { name: 'Pengesahan', exact: true }).click();
  await page.getByRole('button', { name: 'Pengesahan Akhir Belum' }).click();
  await page.locator('[data-test="pengesahan-method-toggle"]').getByText('Tidak Memerlukan Tanda tangan').click();
  await page.getByText('Sila Pilih', { exact: true }).click();
  await page.locator('span').filter({ hasText: 'MUHAMMAD TAUFIQ BIN MOHAMED' }).first().click();
  await page.getByRole('button', { name: 'Hantar Permohonan' }).click();
  await page.waitForTimeout(TIMEOUTS.SHORT);
  await page.getByRole('button', { name: 'Ya, Hantar' }).click();
  await page.waitForTimeout(TIMEOUTS.SHORT);
  await page.getByRole('button', { name: 'OK' }).click();
  
  await page.getByRole('button', { name: 'Log Keluar' }).click();

  //EKP 2
  await page.getByRole('textbox', { name: 'ID Pengguna' }).click();
  await page.getByRole('textbox', { name: 'ID Pengguna' }).fill('taufiq');
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).click();
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).fill('Password123@');
  await page.getByRole('button', { name: 'Log Masuk', exact: true }).click();
  await page.locator('a').filter({ hasText: 'Kelulusan' }).click();
  await page.waitForTimeout(TIMEOUTS.LONG);
  await page.locator('th:nth-child(4) > .flex.min-w-0.items-center.gap-2.text-left.justify-between > .flex > .inline-flex > .iconify').click();
  await page.getByRole('button', { name: 'Lihat Kelulusan' }).first().click();
  await aduan.pilihKeputusan('LULUS');
  await page.getByRole('textbox', { name: 'Masukkan catatan kelulusan...' }).click();
  await page.getByRole('textbox', { name: 'Masukkan catatan kelulusan...' }).fill('lulus');
  await page.getByRole('button', { name: 'Hantar' }).click();
  await page.getByRole('button', { name: 'Ya, Hantar' }).click();
  await page.getByRole('button', { name: 'OK' }).click();
});