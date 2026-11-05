import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.getByRole('textbox', { name: 'ID Pengguna' }).click();
  await page.getByRole('textbox', { name: 'ID Pengguna' }).fill('rosnizamusa');
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).click();
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).fill('Password123@');
  await page.getByRole('button', { name: 'Log Masuk', exact: true }).click();
  await page.getByRole('button', { name: 'Bantuan Utama' }).click();
  await page.locator('a').filter({ hasText: 'Cipta Bantuan Raya' }).click();
  await page.locator('#bu-field-aid div').filter({ hasText: /^Sila Pilih$/ }).click();
  await page.getByLabel('Aid', { exact: true }).getByText('BANTUAN RAMADHAN & HARI RAYA (FAKIR)').click();
  await page.getByText('Sila Pilih', { exact: true }).click();
  await page.getByRole('option', { name: 'RAMADHAN & HARI RAYA (FAKIR)' }).click();
  await page.getByRole('checkbox', { name: 'PEMBAYARAN TERUS (FAKIR) - TT' }).check();
  await page.getByRole('button', { name: 'Tambah' }).click();
  await page.getByText('Sila Pilih', { exact: true }).click();
  await page.locator('span').filter({ hasText: 'PETALING' }).first().click();
  await page.getByText('Pilih satu atau lebih (kosong').click();
  await page.getByRole('listbox').getByText('MASJID ABU BAKAR AS-SIDDIQ').click();
  await page.getByRole('button', { name: 'Cari' }).click();
  await page.getByRole('button', { name: 'Tapis Pilih' }).click();
  await page.locator('div').filter({ hasText: 'Boleh diklik' }).nth(4).click();
  await page.locator('.p-1.rounded.hover\\:bg-gray-100').click();
  await page.getByRole('checkbox', { name: 'Pilih' }).nth(1).check();
  await page.getByRole('button', { name: 'Pilih (1)' }).click();
  await page.locator('.flex > button:nth-child(3)').click();
  await page.locator('input[type="file"]').setInputFiles('a1d1557c58e82554ca7226f90e349f39.jpg');
  await page.getByRole('button', { name: 'Hantar' }).click();
  await page.getByRole('button', { name: 'Ya, Hantar' }).click();

    //EOAD sokong

    await page.getByRole('textbox', { name: 'ID Pengguna' }).click();
  await page.getByRole('textbox', { name: 'ID Pengguna' }).fill('habibullah');
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).click();
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).fill('Password123@');
  await page.getByRole('button', { name: 'Log Masuk', exact: true }).click();
  await page.getByRole('button', { name: 'Bantuan Utama' }).click();
  await page.locator('a').filter({ hasText: 'Senarai Bantuan Utama' }).click();
  await page.locator('th:nth-child(8) > div > .flex > .inline-flex > .iconify').click();
  await page.getByRole('button', { description: 'Semakan', exact: true }).click();
  const downloadPromise = page.waitForEvent('download');
  await page.locator('.flex.items-center > button:nth-child(2)').click();
  const download = await downloadPromise;
  await page.locator('div').filter({ hasText: /^Sila Pilih$/ }).click();
  await page.getByRole('option', { name: 'Lengkap', exact: true }).click();
  await page.getByLabel('Status Semakan*').selectOption('SOKONG');
  await page.getByRole('textbox', { name: 'Catatan*' }).click();
  await page.getByRole('textbox', { name: 'Catatan*' }).fill('sokong');
  await page.getByRole('cell').nth(1).click();
  await page.getByRole('button', { name: 'Hantar' }).click();
  await page.getByRole('button', { name: 'Ya, Hantar' }).click();
  await page.getByRole('button', { name: 'Log Keluar' }).click();


  //KOAD LULUS

   await page.getByRole('textbox', { name: 'ID Pengguna' }).click();
  await page.getByRole('textbox', { name: 'ID Pengguna' }).fill('m.sharil');
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).click();
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).fill('Password123@');
  await page.getByRole('button', { name: 'Log Masuk', exact: true }).click();
  await page.getByRole('button', { name: 'Bantuan Utama' }).click();
  await page.locator('a').filter({ hasText: 'Senarai Bantuan Utama' }).click();
  await page.locator('th:nth-child(8) > div > .flex > .inline-flex > .iconify').click();
  await page.getByRole('button', { description: 'Lihat', exact: true }).click();
  await page.getByLabel('Status Kelulusan*').selectOption('LULUS');
  await page.getByRole('textbox', { name: 'Catatan*' }).click();
  await page.getByRole('textbox', { name: 'Catatan*' }).fill('lulus');
  await page.getByRole('button', { name: 'Hantar' }).click();
  await page.getByRole('button', { name: 'Ya, Luluskan' }).click();
  await page.getByRole('button', { name: 'Log Keluar' }).click();
});