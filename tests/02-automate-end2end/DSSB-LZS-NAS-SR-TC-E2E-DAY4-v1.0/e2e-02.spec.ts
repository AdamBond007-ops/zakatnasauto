import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {

    //EKP kemaskini organisasi
  await page.goto('https://stg.nas-internal.com/login');
  await page.getByRole('textbox', { name: 'ID Pengguna' }).click();
  await page.getByRole('textbox', { name: 'ID Pengguna' }).fill('abdwalid');
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).click();
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).fill('Password123@');
  await page.getByRole('button', { name: 'Log Masuk', exact: true }).click();
  await page.getByRole('button', { name: 'Organisasi' }).click();
  await page.locator('a').filter({ hasText: /^Carian$/ }).click();
  await page.getByText('Sila Pilih').first().click();
  await page.getByRole('option', { name: 'Masjid' }).click();
  await page.getByRole('textbox', { name: 'Nama Organisasi' }).click();
  await page.getByRole('textbox', { name: 'Nama Organisasi' }).fill('masjid');
  await page.getByRole('button', { name: 'Cari' }).click();
 
  await page.getByRole('button', { name: 'Cari' }).click();
  await page.waitForTimeout(3000);
  await page.locator('th:nth-child(7) > .flex.min-w-0.items-center.gap-2.text-left.justify-between > .flex > .inline-flex > .iconify').click();
  await page.getByRole('button', { name: 'Lihat' }).first().click();
  await page.getByRole('button', { name: 'Kemaskini' }).click();
  await page.getByRole('button', { name: 'Seterusnya' }).click();
  await page.getByRole('textbox', { name: 'Alamat 2' }).click();
  await page.getByRole('textbox', { name: 'Alamat 2' }).fill('92929WWWHDh');
  await page.getByRole('textbox', { name: 'Alamat 3' }).click();
  await page.getByRole('textbox', { name: 'Alamat 3' }).fill('OOOSDSIdj');
  await page.getByRole('button', { name: 'Seterusnya' }).click();
  await page.getByRole('textbox', { name: 'Nama Wakil / Pegawai Utama*' }).click();
  await page.getByRole('textbox', { name: 'Nama Wakil / Pegawai Utama*' }).fill('LAURIANE KAKi');
  await page.getByRole('button', { name: 'Seterusnya' }).click();
  await page.getByRole('button', { name: 'Seterusnya' }).click();
  await page.getByRole('button', { name: 'Teruskan' }).click();
  await page.getByRole('button', { name: 'Hantar' }).click();
  await page.getByRole('button', { name: 'Ya, Hantar' }).click();
  await page.waitForTimeout(3000);
  await page.getByRole('button', { name: 'Log Keluar' }).click();

//admin agihan sah

await page.getByRole('textbox', { name: 'ID Pengguna' }).click();
  await page.getByRole('textbox', { name: 'ID Pengguna' }).fill('ZAKATSELzulfalihin');
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).click();
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).fill('Password123@');
  await page.getByRole('button', { name: 'Log Masuk', exact: true }).click();
  await page.getByRole('button', { name: 'Organisasi' }).click();
  await page.locator('a').filter({ hasText: 'Senarai Organisasi' }).click();
  await page.locator('th:nth-child(6) > .flex.min-w-0.items-center.gap-2.text-left.justify-between > .flex > .inline-flex > .iconify').click();
  await page.getByRole('button', { name: 'Lihat' }).first().click();
  await page.getByRole('button', { name: 'Kembali' }).click();
  await page.locator('th:nth-child(6) > .flex.min-w-0.items-center.gap-2.text-left.justify-between > .flex > .inline-flex > .iconify').click();
  await page.getByRole('button', { name: 'Pengesahan' }).click();
  await page.locator('th:nth-child(6) > .flex.min-w-0.items-center.gap-2.text-left.justify-between > .flex > .inline-flex > .iconify').click();
  await page.getByRole('button', { name: 'Pengesahan' }).nth(1).click();
  await page.getByText('Sila Pilih').click();
  await page.locator('span').filter({ hasText: 'Sah' }).first().click();
  await page.getByRole('textbox', { name: 'Catatan*' }).click();
  await page.getByRole('textbox', { name: 'Catatan*' }).fill('sah');
  await page.locator('.flex.flex-col.gap-2').first().click();
  await page.getByRole('button', { name: 'Ya, teruskan' }).click();
  await page.getByRole('button', { name: 'Ya, Hantar' }).click();
  await page.waitForTimeout(3000);
  await page.getByRole('button', { name: 'Log Keluar' }).click();

    //pelulus admin agihan lulus

  await page.getByRole('textbox', { name: 'ID Pengguna' }).click();
  await page.getByRole('textbox', { name: 'ID Pengguna' }).fill('ZAKATSELzulfalihin');
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).click();
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).fill('Password123\\2');
  await page.getByRole('button', { name: 'Log Masuk', exact: true }).click();
  await page.getByRole('button', { name: 'OK' }).click();
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).click();
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).fill('Password123@');
  await page.getByRole('button', { name: 'Log Masuk', exact: true }).click();
  await page.getByRole('button', { name: 'Organisasi' }).click();
  await page.locator('a').filter({ hasText: 'Senarai Organisasi' }).click();
  await page.locator('th:nth-child(6) > .flex.min-w-0.items-center.gap-2.text-left.justify-between > .flex > .inline-flex > .iconify').click();
  await page.getByRole('button', { name: 'Lihat' }).first().click();
  await page.getByRole('button', { name: 'Kembali' }).click();
  await page.locator('th:nth-child(6) > .flex.min-w-0.items-center.gap-2.text-left.justify-between > .flex > .inline-flex > .iconify').click();
  await page.getByRole('button', { name: 'Pengesahan' }).click();
  await page.locator('th:nth-child(6) > .flex.min-w-0.items-center.gap-2.text-left.justify-between > .flex > .inline-flex > .iconify').click();
  await page.getByRole('button', { name: 'Pengesahan' }).nth(1).click();
  await page.getByText('Sila Pilih').click();
  await page.locator('span').filter({ hasText: 'Sah' }).first().click();
  await page.getByRole('textbox', { name: 'Catatan*' }).click();
  await page.getByRole('textbox', { name: 'Catatan*' }).fill('sah');
  await page.locator('.flex.flex-col.gap-2').first().click();
  await page.getByRole('button', { name: 'Ya, teruskan' }).click();
  await page.getByRole('button', { name: 'Ya, Hantar' }).click();
  await page.waitForTimeout(3000);
  await page.getByRole('button', { name: 'Log Keluar' }).click();
  await page.getByRole('textbox', { name: 'ID Pengguna' }).click();
  await page.getByRole('textbox', { name: 'ID Pengguna' }).click();
  await page.getByRole('textbox', { name: 'ID Pengguna' }).fill('rizal79');
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).click();
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).fill('Password123@');
  await page.getByRole('button', { name: 'Log Masuk', exact: true }).click();
  await page.getByRole('button', { name: 'Organisasi' }).click();
  await page.locator('a').filter({ hasText: 'Kelulusan' }).click();
  await page.locator('th:nth-child(5) > .flex.min-w-0.items-center.gap-2.text-left.justify-between > .flex > .inline-flex > .iconify').click();
  await page.getByRole('button', { name: 'Kelulusan' }).nth(1).click();
  await page.getByText('Sila Pilih').click();
  await page.locator('span').filter({ hasText: 'Lulus' }).nth(2).click();
  await page.getByRole('textbox', { name: 'Catatan*' }).click();
  await page.getByRole('textbox', { name: 'Catatan*' }).fill('lulus');
  await page.getByRole('button', { name: 'Hantar' }).click();
  await page.getByRole('button', { name: 'Ya, Luluskan' }).click();
  await page.waitForTimeout(3000);

});