import { test, expect } from '@playwright/test';

test('TC-NAS-FMEKPBARU-01-SA-01', async ({ page }) => {
  /*
  Author: MAA
  Date: 25/07/2026
  Expected Result: 
  i. Tiada profil ditemui dengan maklumat yang dimasukkan.
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
  await page.getByRole('textbox', { name: 'No Pengenalan' }).click();
  await page.getByRole('textbox', { name: 'No Pengenalan' }).fill('910710105184');
  await page.getByRole('button', { name: 'Cari' }).click();
  
  //Validaition of no record
  await expect(
    page.getByText(
      'Tiada profil ditemui dengan maklumat yang dimasukkan',
      { exact: true }
    )
  ).toBeVisible();
});