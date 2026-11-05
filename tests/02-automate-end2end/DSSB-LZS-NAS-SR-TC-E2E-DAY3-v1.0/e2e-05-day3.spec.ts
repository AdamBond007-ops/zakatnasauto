
 
import { test, expect, type Locator } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { join } from 'path';

async function uploadFile(fileInput: Locator): Promise<void> {
  await fileInput.setInputFiles(join(__dirname, 'a1d1557c58e82554ca7226f90e349f39.jpg'));
}

async function uploadFileFromButton(button: Locator): Promise<void> {
  const [fileChooser] = await Promise.all([
    button.page().waitForEvent('filechooser'),
    button.click(),
  ]);
  await fileChooser.setFiles(join(__dirname, 'a1d1557c58e82554ca7226f90e349f39.jpg'));
}

test('test', async ({ page }) => {
  const programName = `Test Mesy PAK ${faker.lorem.word()}`;
await page.goto('https://stg.nas-internal.com/login');
await page.getByRole('textbox', { name: 'ID Pengguna' }).click();
  await page.getByRole('textbox', { name: 'ID Pengguna' }).fill('zakatselsyahidah');
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).click();
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).fill('Password123@');
  await page.getByRole('button', { name: 'Log Masuk', exact: true }).click();
  await page.getByRole('button', { name: 'Program' }).click();
  await page.locator('a').filter({ hasText: 'Cipta Program' }).click();
  await page.getByText('Sila Pilih', { exact: true }).click();
  await page.getByLabel('Jenis Program', { exact: true }).getByText('Mesyuarat/Program').click();
  await page.locator('div').filter({ hasText: /^Sila Pilih$/ }).first().click();
  await page.getByRole('option', { name: 'Mesyuarat' }).click();
  await page.getByRole('textbox', { name: 'Nama Program*' }).click();
  await page.getByRole('textbox', { name: 'Nama Program*' }).fill(programName);
  await page.getByRole('textbox', { name: 'Tempat Program*' }).click();
  await page.getByRole('textbox', { name: 'Tempat Program*' }).fill('YUYUYu');
  await page.getByRole('textbox', { name: 'No Rumah / Lot / Blok' }).click();
  await page.getByRole('textbox', { name: 'No Rumah / Lot / Blok' }).fill('TESt');
  await page.getByRole('textbox', { name: 'Jalan / Lorong' }).click();
  await page.getByRole('textbox', { name: 'Jalan / Lorong' }).fill('TETs');
  await page.getByRole('textbox', { name: 'Poskod*' }).click();
  await page.getByRole('textbox', { name: 'Poskod*' }).fill('46200');
  await page.locator('div').filter({ hasText: /^Sila Pilih$/ }).click();
  await page.getByRole('listbox').getByText('MASJID ABU BAKAR AS-SIDDIQ').click();
  await page.getByRole('textbox', { name: 'Bilangan Peserta*' }).click();
  await page.getByRole('textbox', { name: 'Bilangan Peserta*' }).fill('20');
  await page.getByRole('textbox', { name: 'Jumlah Hari Program*' }).click();
  await page.getByRole('textbox', { name: 'Jumlah Hari Program*' }).fill('1');
  await page.getByRole('textbox', { name: 'Tarikh Mula*' }).fill('2026-11-06');
  await page.locator('input[type="time"]').nth(0).fill('14:16');
  await page.locator('input[type="time"]').nth(1).fill('18:19');
  await page.getByRole('textbox', { name: 'Catatan*' }).click();
  await page.getByRole('textbox', { name: 'Catatan*' }).fill('catatan');
  await uploadFileFromButton(page.getByRole('button', { name: 'Pilih Fail' }));
  await page.getByRole('button', { name: 'Seterusnya' }).click();

await page.getByRole('radio', { name: 'Asnaf' }).check();
  await page.getByRole('button', { name: 'Pilih Peserta' }).click();
  await page.getByText('Sila Pilih').first().click();
  await page.locator('span').filter({ hasText: 'PETALING' }).nth(2).click();
  await page.getByText('Pilih satu atau lebih (kosong').click();
  await page.getByRole('option', { name: 'MASJID ABU BAKAR AS-SIDDIQ' }).click();
  await page.locator('.iconify.i-heroicons\\:chevron-down.dropdown-arrow.is-rotated').click();
  await page.getByRole('button', { name: 'Cari' }).click();
  await page.getByRole('checkbox', { name: 'Pilih semua pada halaman ini' }).check();
  await page.getByRole('button', { name: 'Pilih Peserta' }).nth(1).click();

  await page.getByRole('button', { name: 'Seterusnya', exact: true }).click();
  await page.getByRole('button', { name: 'Hantar Program' }).click();
  await page.getByRole('button', { name: 'Log Keluar' }).click();


    //LULUS

  await page.getByRole('textbox', { name: 'ID Pengguna' }).click();
  await page.getByRole('textbox', { name: 'ID Pengguna' }).fill('salahuddin');
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).click();
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).fill('Password123@');
  await page.locator('.flex.justify-end').click();
  await page.getByRole('button', { name: 'Log Masuk', exact: true }).click();
  await page.getByRole('button', { name: 'Program' }).click();
  await page.getByText('ProgramCipta ProgramSenarai ProgramSenarai KelulusanMaklumat Bantuan').click();
  await page.locator('a').filter({ hasText: 'Senarai Kelulusan' }).click();
  await page.locator('th:nth-child(6) > .flex.min-w-0.items-center.gap-2.text-left.justify-between > .flex > .inline-flex > .iconify').click();
  await page.locator('.inline-flex.items-center.justify-center.w-8').first().click();
  await page.getByText('Sila Pilih').click();
  await page.locator('span').filter({ hasText: 'Lulus' }).nth(4).click();
  await page.getByRole('textbox', { name: 'Catatan*' }).click();
  await page.getByRole('textbox', { name: 'Catatan*' }).fill('lulus');
  await page.getByRole('button', { name: 'Hantar' }).click();
});
 
