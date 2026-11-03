import { test, expect } from '@playwright/test';

test('TC-NAS-FMEKPBARU-02-SU-01', async ({ page }) => {
/*
  Author: MAA
  Date: 25/07/2026
  Expected Result: 
  i. Sistem memaparkan Borang Carian Asnaf Perseorangan.
*/
  await page.goto('https://stg.nas-internal.com/login');
  await page.getByRole('textbox', { name: 'ID Pengguna' }).click();
  await page.getByRole('textbox', { name: 'ID Pengguna' }).fill('azizul');
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).click();
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).click();
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).fill('Password123@');
  await page.getByRole('button', { name: 'Log Masuk', exact: true }).click();
  await page.locator('a').filter({ hasText: 'Carian Asnaf' }).click();

  
  await page.locator('div').filter({ hasText: /^Sila Pilih$/ }).click();
  await page.getByRole('listbox').getByText('MyKad / MyKid').click();
  await page.waitForTimeout(5000); // Wait for 5 seconds
  await page.getByRole('textbox', { name: 'No Pengenalan' }).click();
  await page.getByRole('textbox', { name: 'No Pengenalan' }).fill('910710035184');
  await page.waitForTimeout(5000); // Wait for 5 seconds
  await page.getByRole('textbox', { name: 'Nama', exact: true }).fill('AMINAH');
  await page.waitForTimeout(5000); // Wait for 5 seconds
  await page.getByRole('button', { name: 'Cari' }).click();
 
  await page.waitForTimeout(5000); // Wait for 5 seconds
  
  await page.getByRole('button', {
    name: 'Isi Borang Permohonan'
  }).click();

  await page.waitForTimeout(5000); // Wait for 8 seconds
  await page.getByRole('button', { name: 'Daftar tanpa Validasi' }).click();

  await page.waitForTimeout(5000); // Wait for 8 seconds

  //validation form Appearing
  const section = page
  .locator('.form-section')
  .filter({ hasText: 'A. Aduan: Maklumat Individu' });

  await expect(section).toBeVisible();

  await expect(
    section.locator('input[name="aduan_individu.nama_penuh"]')
  ).toHaveValue('AMINAH');
  
});