import { test, expect, Page } from '@playwright/test';
import path from 'path';

async function uploadTestingPdf(browserPage: Page) {
    const filePath = path.join(__dirname, 'testing.pdf');
 
    const fileChooserPromise = browserPage.waitForEvent('filechooser');
 
    await browserPage.getByTestId('bu-tuntutan-tpa-dokumen-1-upload').click();
 
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(filePath);
    await browserPage.waitForTimeout(1000);

    await browserPage.getByTestId('bu-tuntutan-tpa-btn-simpan').click();
    await browserPage.waitForTimeout(6000);
}

async function uploadExcelFile(browserPage: Page) {
    const filePath = path.join(__dirname, 'Data-Asnaf-to-TPA-20260910100835.xlsx');

    await browserPage.getByTestId('bu-tuntutan-tpa-senarai-upload-btn').click();
    await browserPage.waitForTimeout(1000);

    const fileChooserPromise = browserPage.waitForEvent('filechooser');
    await browserPage.getByTestId('bu-tuntutan-tpa-senarai-upload-pilih-fail').click();
    
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(filePath);
    await browserPage.waitForTimeout(1000);

    await browserPage.getByTestId('bu-tuntutan-tpa-senarai-upload-terapkan').click();
    await browserPage.waitForTimeout(6000);
}

test('test', async ({ page }) => {
  await page.goto('https://stg.nas-internal.com/login');
  await page.getByRole('textbox', { name: 'ID Pengguna' }).click();
  await page.getByRole('textbox', { name: 'ID Pengguna' }).fill('syafiq.a');
  await page.getByRole('textbox', { name: 'ID Pengguna' }).press('Tab');
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).fill('Password123@');
  await page.getByRole('button', { name: 'Log Masuk', exact: true }).click();
  await page.getByRole('button', { name: 'Tukar Peranan' }).click();
  await page.getByRole('menuitem', { name: 'PT_BTN' }).click();
  await page.getByRole('button', { name: 'Bantuan Utama' }).click();
  await page.locator('a').filter({ hasText: 'Senarai Bantuan Utama' }).click();
  await page.getByRole('button', { name: 'Lulus (KPS)' }).click();
  await page.locator('table tbody tr').first().locator('td').nth(1).locator('input[type="checkbox"]').check();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download (1)' }).click();
  const download = await downloadPromise;
  await page.waitForTimeout(6000);
  await page.locator('a').filter({ hasText: 'Cipta Tuntutan TPA' }).click();
  await page.getByTestId('bu-tuntutan-tpa-kategori-asnaf').selectOption('Fakir');
  await page.getByTestId('bu-tuntutan-tpa-no-invoice-customer').click();
  const randomEightDigits = Math.floor(10000000 + Math.random() * 90000000).toString();
    await page.getByTestId('bu-tuntutan-tpa-no-invoice-customer').fill(randomEightDigits);   
  await page.getByRole('textbox', { name: 'Amaun Invoice (RM)*' }).click();
  await page.getByRole('textbox', { name: 'Amaun Invoice (RM)*' }).fill('10.00');
  await page.getByTestId('bu-tuntutan-tpa-tarikh-invoice-customer').fill('2026-09-09');
  await page.getByTestId('bu-tuntutan-tpa-catatan').click();
  await page.getByTestId('bu-tuntutan-tpa-catatan').fill('catatan');

    // // Define the file path using Node's path or direct relative path since it's in the same folder
    // const filePath = 'Data-Asnaf-to-TPA-20260909122142.xlsx';

    // await page.getByTestId('bu-tuntutan-tpa-senarai-upload-btn').click();
    // await page.waitForTimeout(1000);

    // await page.getByTestId('bu-tuntutan-tpa-senarai-upload-pilih-fail').click();

    // // Automatically attach and upload the file from the local workspace folder
    // await page.getByTestId('bu-tuntutan-tpa-senarai-upload-file').setInputFiles(filePath);
    // await page.waitForTimeout(1000);

    // await page.getByTestId('bu-tuntutan-tpa-senarai-upload-terapkan').click();
    // await page.waitForTimeout(6000);

    await uploadExcelFile(page);

  await page.getByRole('textbox', { name: 'Amaun Invoice (RM)*' }).click();
  await page.getByRole('textbox', { name: 'Amaun Invoice (RM)*' }).fill('10.00');

  await uploadTestingPdf(page);

  await page.locator('a').filter({ hasText: 'Senarai Tuntutan TPA' }).click();
  await page.locator('th:nth-child(9) > div > .flex > .inline-flex > .iconify').click();
  // Click the last interactive link/button in the action column (the pencil/edit icon is always on the right)
  await page.locator('table tbody tr').first().locator('td').last().locator('a, button').last().click();  
  await page.getByTestId('bu-tuntutan-tpa-btn-hantar').click();
  await page.getByRole('button', { name: 'Ya, Hantar' }).click();
  await page.waitForTimeout(6000);
  await page.getByRole('button', { name: 'Log Keluar' }).click();

  //EOAD Pinda

  await page.getByRole('textbox', { name: 'ID Pengguna' }).click();
  await page.getByRole('textbox', { name: 'ID Pengguna' }).fill('amanina.ar');
  await page.getByRole('textbox', { name: 'ID Pengguna' }).press('Tab');
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).fill('Password123@');
  await page.getByRole('button', { name: 'Log Masuk', exact: true }).click();
  await page.getByRole('button', { name: 'Bantuan Utama' }).click();
  await page.locator('a').filter({ hasText: 'Senarai Tuntutan TPA' }).click();
  await page.locator('.inline-flex.items-center.justify-center.w-8').click();
  await page.getByTestId('bu-tuntutan-tpa-semakan-status-action').selectOption('PINDAAN_EOAD');
  await page.getByTestId('bu-tuntutan-tpa-semakan-catatan').click();
  await page.getByTestId('bu-tuntutan-tpa-semakan-catatan').fill('Pindaan test');
  await page.locator('.px-3 > .formkit-outer > .formkit-wrapper > .formkit-inner > .formkit-select-search > .select-trigger > .iconify.i-heroicons\\:chevron-down').click();
  await page.locator('span').filter({ hasText: 'Lengkap' }).first().click();
  await page.getByTestId('bu-tuntutan-tpa-semakan-btn-hantar').click();
  await page.getByRole('button', { name: 'Ya, Hantar' }).click();
  await page.getByRole('button', { name: 'OK' }).click();
  await page.waitForTimeout(6000);
  await page.getByRole('button', { name: 'Log Keluar' }).click();

    // PT BTN hantar semula pindaan

  await page.getByRole('textbox', { name: 'ID Pengguna' }).click();
  await page.getByRole('textbox', { name: 'ID Pengguna' }).fill('syafiq.a');
  await page.getByRole('textbox', { name: 'ID Pengguna' }).press('Tab');
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).fill('Password123@');
  await page.getByRole('button', { name: 'Log Masuk', exact: true }).click();
  await page.waitForTimeout(3000);
  await page.getByRole('button', { name: 'Tukar Peranan' }).click();
  await page.getByRole('menuitem', { name: 'PT_BTN' }).click();
  await page.getByRole('button', { name: 'Bantuan Utama' }).click();
  await page.locator('a').filter({ hasText: 'Senarai Tuntutan TPA' }).click();
  await page.getByRole('button', { name: 'Pindaan' }).click();
  await page.locator('.inline-flex.items-center.justify-center.w-8.h-8.rounded.transition-colors.text-gray-600').click();
  await page.getByTestId('bu-tuntutan-tpa-btn-hantar').click();
  await page.getByRole('button', { name: 'Ya, Hantar' }).click();
  await page.waitForTimeout(6000);
  await page.getByRole('button', { name: 'Log Keluar' }).click();


  //EOAD hantar tuntutan

  await page.getByRole('textbox', { name: 'ID Pengguna' }).click();
  await page.getByRole('textbox', { name: 'ID Pengguna' }).fill('amanina.ar');
  await page.getByRole('textbox', { name: 'ID Pengguna' }).press('Tab');
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).fill('Password123@');
  await page.getByRole('button', { name: 'Log Masuk', exact: true }).click();
  await page.getByRole('button', { name: 'Bantuan Utama' }).click();
  await page.locator('a').filter({ hasText: 'Senarai Tuntutan TPA' }).click();
  await page.locator('th:nth-child(9) > div > .flex > .inline-flex > .iconify').click();
  await page.getByRole('button', { description: 'Semakan', exact: true }).click();
  await page.getByTestId('bu-tuntutan-tpa-semakan-status-action').selectOption('SOKONG');
  await page.getByTestId('bu-tuntutan-tpa-semakan-catatan').click();
  await page.getByTestId('bu-tuntutan-tpa-semakan-catatan').fill('test sokong');
  await page.getByTestId('bu-tuntutan-tpa-semakan-btn-hantar').click();
  await page.getByRole('button', { name: 'Ya, Hantar' }).click();
  await page.getByRole('button', { name: 'OK' }).click();
  await page.waitForTimeout(6000);
  await page.getByRole('button', { name: 'Log Keluar' }).click();

  //KOAD pinda

  await page.getByRole('textbox', { name: 'ID Pengguna' }).click();
  await page.getByRole('textbox', { name: 'ID Pengguna' }).fill('rizal79');
  await page.getByRole('textbox', { name: 'ID Pengguna' }).press('Tab');
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).fill('Password123@');
  await page.getByRole('button', { name: 'Log Masuk', exact: true }).click();
  await page.getByRole('button', { name: 'Bantuan Utama' }).click();
  await page.locator('a').filter({ hasText: 'Senarai Tuntutan TPA' }).click();
  await page.locator('th:nth-child(9) > div > .flex > .inline-flex > .iconify').click();
  await page.getByRole('button', { description: 'Kelulusan', exact: true }).click();
  await page.getByTestId('bu-tuntutan-tpa-semakan-status-action').selectOption('PINDAAN_PELULUS');
  await page.getByTestId('bu-tuntutan-tpa-semakan-catatan').click();
  await page.getByTestId('bu-tuntutan-tpa-semakan-catatan').fill('test pinda');
  await page.getByTestId('bu-tuntutan-tpa-semakan-btn-hantar').click();
  await page.getByRole('button', { name: 'Ya, Hantar' }).click();
  await page.getByRole('button', { name: 'OK' }).click();
  await page.waitForTimeout(6000);
  await page.getByRole('button', { name: 'Log Keluar' }).click();

  //EOAD hantar semula

  await page.getByRole('textbox', { name: 'ID Pengguna' }).click();
  await page.getByRole('textbox', { name: 'ID Pengguna' }).fill('amanina.ar');
  await page.getByRole('textbox', { name: 'ID Pengguna' }).press('Tab');
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).fill('Password123@');
  await page.getByRole('button', { name: 'Log Masuk', exact: true }).click();
  await page.getByRole('button', { name: 'Bantuan Utama' }).click();
  await page.locator('a').filter({ hasText: 'Senarai Tuntutan TPA' }).click();
  await page.getByRole('button', { name: 'Pindaan Pelulus' }).click();
  await page.locator('th:nth-child(9) > div > .flex > .inline-flex > .iconify').click();
  await page.locator('.inline-flex.items-center.justify-center.w-8').click();
  await page.getByTestId('bu-tuntutan-tpa-semakan-status-action').selectOption('SOKONG');
  await page.getByTestId('bu-tuntutan-tpa-semakan-catatan').click();
  await page.getByTestId('bu-tuntutan-tpa-semakan-catatan').fill('sokong test');
  await page.getByTestId('bu-tuntutan-tpa-semakan-btn-hantar').click();
  await page.getByRole('button', { name: 'Ya, Hantar' }).click();
  await page.getByRole('button', { name: 'OK' }).click();
  await page.waitForTimeout(6000);
  await page.getByRole('button', { name: 'Log Keluar' }).click();

  //KOAD luluskan
  await page.getByRole('textbox', { name: 'ID Pengguna' }).click();
  await page.getByRole('textbox', { name: 'ID Pengguna' }).fill('rizal79');
  await page.getByRole('textbox', { name: 'ID Pengguna' }).press('Tab');
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).fill('Password123@');
  await page.getByRole('button', { name: 'Log Masuk', exact: true }).click();
  await page.getByRole('button', { name: 'Bantuan Utama' }).click();
  await page.locator('a').filter({ hasText: 'Senarai Tuntutan TPA' }).click();
  await page.locator('th:nth-child(9) > div > .flex > .inline-flex > .iconify').click();
  await page.locator('.inline-flex.items-center.justify-center.w-8').click();
  await page.getByTestId('bu-tuntutan-tpa-semakan-status-action').selectOption('LULUS');
  await page.getByTestId('bu-tuntutan-tpa-semakan-catatan').click();
  await page.getByTestId('bu-tuntutan-tpa-semakan-catatan').fill('LULUS');
  await page.getByTestId('bu-tuntutan-tpa-semakan-btn-hantar').click();
  await page.getByRole('button', { name: 'Ya, Hantar' }).click();
  await page.getByRole('button', { name: 'OK' }).click();
  await page.waitForTimeout(6000);
  await page.getByRole('button', { name: 'Log Keluar' }).click();

  //PT BTN check notification
  await page.getByRole('textbox', { name: 'ID Pengguna' }).fill('syafiq.a');
  await page.getByRole('textbox', { name: 'ID Pengguna' }).press('Tab');
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).fill('Password123@');
  await page.getByRole('button', { name: 'Log Masuk', exact: true }).click();
  await page.getByRole('button', { name: 'Tukar Peranan' }).click();
  await page.getByRole('menuitem', { name: 'PT_BTN' }).click();
  await page.getByRole('button', { name: 'Notifikasi' }).click();
});