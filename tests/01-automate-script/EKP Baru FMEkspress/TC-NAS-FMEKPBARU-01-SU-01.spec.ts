import { test, expect } from '@playwright/test';

test('TC-NAS-FMEKPBARU-01-SU-01', async ({ page }) => {
    /*
  Author: MAA
  Date: 25/07/2026
  Expected Result: 
  i. Record ditemui dengan maklumat yang dimasukkan.
*/
  await page.goto('https://stg.nas-internal.com/login');

  await page.getByRole('textbox', { name: 'ID Pengguna' }).fill('azizul');
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).fill('Password123@');
  await page.getByRole('button', { name: 'Log Masuk', exact: true }).click();

  await page.locator('a').filter({ hasText: 'Carian Asnaf' }).click();

  await page.locator('div').filter({ hasText: /^Sila Pilih$/ }).click();
  await page.getByRole('listbox').getByText('MyKad / MyKid').click();

  await page
    .getByRole('textbox', { name: 'No Pengenalan' })
    .fill('680710105184');

  await page.getByRole('button', { name: 'Cari' }).click();

  // Validate search result
  await expect(
    page.getByRole('heading', {
      name: 'Hasil Carian (1 profil dijumpai)',
    })
  ).toBeVisible();

  const resultRow = page
    .getByRole('table')
    .getByRole('row')
    .filter({ hasText: '680710105184' });

  await expect(resultRow).toBeVisible();
  await expect(resultRow).toContainText('680710105184');
  await expect(resultRow).toContainText('MyKad / MyKid');
  await expect(resultRow).toContainText('RAPIAH BINTI IBRAHIM');
  await expect(resultRow).toContainText('MASJID AL ANSAR, PEKAN KAPAR');
  await expect(resultRow).toContainText('Fakir');
  await expect(resultRow).toContainText('Aktif');
  await expect(resultRow).toContainText('Ketua Keluarga');
  await expect(resultRow).toContainText('Permohonan Diluluskan');
  await expect(resultRow).toContainText('DM');
});