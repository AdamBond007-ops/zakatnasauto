// import { test, expect, type Locator } from '@playwright/test';
// import { faker } from '@faker-js/faker';
// import { join } from 'path';

// async function uploadFile(fileInput: Locator): Promise<void> {
//   await fileInput.setInputFiles(join(__dirname, 'a1d1557c58e82554ca7226f90e349f39.jpg'));
// }

// test('test', async ({ page }) => {
 
//    await page.goto('https://stg.nas-internal.com/login');
//  await page.getByRole('textbox', { name: 'ID Pengguna' }).click();
//   await page.getByRole('textbox', { name: 'ID Pengguna' }).fill('abdwalid');
//   await page.getByRole('textbox', { name: 'Kata Laluan*' }).click();
//   await page.getByRole('textbox', { name: 'Kata Laluan*' }).fill('Password123@');
//   await page.getByRole('button', { name: 'Log Masuk', exact: true }).click();
//   await page.getByRole('button', { name: 'Tuntutan' }).click();
//   await page.locator('a').filter({ hasText: 'Senarai Tuntutan' }).click();
//   await page.locator('a').filter({ hasText: 'Pengurusan Tuntutan' }).click();
//   await page.waitForTimeout(3000);
//   await page.getByRole('searchbox', { name: 'Cari...' }).click();
//   await page.getByRole('searchbox', { name: 'Cari...' }).fill('kaxxx');
//   await page.getByRole('button', { name: 'Mohon Tuntutan' }).first().click();
//   await page.getByRole('textbox', { name: 'No. Invoice Customer*' }).click();
//   await page.getByRole('textbox', { name: 'No. Invoice Customer*' }).fill(faker.string.numeric(8));
//   await page.getByRole('textbox', { name: 'Amaun Tuntutan (RM)*' }).click();
//   await page.getByRole('textbox', { name: 'Amaun Tuntutan (RM)*' }).fill('200');
//   await page.getByRole('textbox', { name: 'Catatan*' }).click();
//   await page.getByRole('textbox', { name: 'Catatan*' }).fill('catatan');
//   await page.getByRole('button', { name: 'Muat Naik Dokumen' }).click();
//   await uploadFile(page.locator('input[type="file"]').first());
//   await page.getByRole('textbox', { name: 'Tarikh Invoice Customer*' }).fill('2026-11-05');
//   await page.getByRole('button', { name: 'Hantar' }).click();
//   await page.getByRole('button', { name: 'Ya, Hantar' }).click();
//   await page.getByRole('button', { name: 'Log Keluar' }).click();


//   //KJPSK
//   await page.getByRole('textbox', { name: 'ID Pengguna' }).click();
//   await page.getByRole('textbox', { name: 'ID Pengguna' }).fill('fadhli');
//   await page.getByRole('textbox', { name: 'Kata Laluan*' }).click();
//   await page.getByRole('textbox', { name: 'Kata Laluan*' }).fill('Password123@');
//   await page.getByRole('button', { name: 'Log Masuk', exact: true }).click();
//   await page.getByRole('button', { name: 'Tuntutan' }).click();
//   await page.locator('a').filter({ hasText: 'Senarai Kelulusan' }).click();
//   await page.getByRole('searchbox', { name: 'Cari...' }).click();
//   await page.getByRole('searchbox', { name: 'Cari...' }).fill('kaxxx');
//   await page.waitForTimeout(5000);

//   await page.getByRole('button', { name: 'Lihat' }).click();
//   await page.getByRole('table').getByText('Sila Pilih', { exact: true }).click();
//   await page.locator('span').filter({ hasText: 'Lengkap' }).first().click();
//   await page.getByText('Sila Pilih', { exact: true }).click();
//   await page.locator('span').filter({ hasText: 'Lulus' }).nth(1).click();
//   await page.getByRole('textbox', { name: 'Catatan*' }).click();
//   await page.getByRole('textbox', { name: 'Catatan*' }).fill('Lulus');
//   await page.getByRole('button', { name: 'Hantar' }).click();
//   await page.getByRole('button', { name: 'Ya, Hantar' }).click();
//   await page.getByRole('button', { name: 'Log Keluar' }).click();

//   });

import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { join } from 'path';


async function uploadFile(fileInput: import('@playwright/test').Locator): Promise<void> {
  await fileInput.setInputFiles(join(__dirname, 'a1d1557c58e82554ca7226f90e349f39.jpg'));
}

function generateMasjidName(): string {
  return `Masjid ${faker.lorem.words(3)}`;
}

function generateMalaysianIc(): string {
  const birthDate = faker.date.birthdate({ min: 19, max: 65, mode: 'age' });
  const datePart = `${String(birthDate.getFullYear()).slice(-2)}${String(birthDate.getMonth() + 1).padStart(2, '0')}${String(birthDate.getDate()).padStart(2, '0')}`;
  return `${datePart}${faker.string.numeric(6)}`;
}

function generateMalaysianPhoneNumber(): string {
  const prefix = faker.helpers.arrayElement(['010', '011', '012', '013', '014', '016', '017', '018', '019']);
  return `${prefix}${faker.string.numeric(prefix === '011' ? 8 : 7)}`;
}

function generateEmail(): string {
  return `shafiyadam83+${faker.string.numeric(7)}@gmail.com`;
}

test('test', async ({ page }) => {
await page.goto('https://stg.nas-internal.com/login');
//EKP
  //ekp daftar baru
  await page.getByRole('textbox', { name: 'ID Pengguna' }).click();
  await page.getByRole('textbox', { name: 'ID Pengguna' }).fill('abdwalid');
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).click();
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).fill('Password123@');
  await page.getByRole('button', { name: 'Log Masuk', exact: true }).click();
  await page.getByRole('button', { name: 'Organisasi' }).click();
  await page.locator('a').filter({ hasText: /^Carian$/ }).click();
  await page.getByText('Sila Pilih').first().click();
  await page.locator('span').filter({ hasText: 'Masjid' }).first().click();
  await page.getByRole('textbox', { name: 'Nama Organisasi' }).click();
  const masjidName = generateMasjidName();
  await page.getByRole('textbox', { name: 'Nama Organisasi' }).fill(masjidName);

  await page.getByRole('button', { name: 'Cari' }).click();
  await page.getByRole('button', { name: 'Daftar Organisasi Baharu' }).click();
  await page.getByRole('textbox', { name: 'Nombor Pendaftaran Organisasi' }).click();
  const registrationNumber = faker.string.numeric(14);
  await page.getByRole('textbox', { name: 'Nombor Pendaftaran Organisasi' }).fill(registrationNumber);
  await page.getByText('Sila Pilih').click();
  await page.locator('span').filter({ hasText: 'Kariah' }).first().click();
  await page.getByRole('textbox', { name: 'Kawasan / Zon (jika berkaitan)' }).click();
  await page.getByRole('textbox', { name: 'Kawasan / Zon (jika berkaitan)' }).fill('PUCHONg');
  await page.getByRole('button', { name: 'Seterusnya' }).click();
  await page.getByRole('textbox', { name: 'Alamat 1*' }).click();
  await page.getByRole('textbox', { name: 'Alamat 1*' }).fill('TEST ALAMAAKKk');
  await page.getByRole('textbox', { name: 'Alamat 2' }).click();
  await page.getByRole('textbox', { name: 'Alamat 2' }).fill('TESTt');
  
  await page.getByRole('textbox', { name: 'Poskod*' }).click();
  await page.getByRole('textbox', { name: 'Poskod*' }).fill('46200');
  await page.locator('div:nth-child(8) > .formkit-wrapper > .formkit-inner').click();
  await page.getByRole('textbox', { name: 'Bandar*' }).fill('JAYa');
  await page.locator('.formkit-inner.formkit-inner-box').first().click();
  await page.getByRole('button', { name: 'Seterusnya' }).click();
  const representativeName = faker.person.fullName();
  const representativeIc = generateMalaysianIc();
  const representativePhone = generateMalaysianPhoneNumber();
  const representativeEmail = generateEmail();
  await page.getByRole('textbox', { name: 'Nama Wakil / Pegawai Utama*' }).click();
  await page.getByRole('textbox', { name: 'Nama Wakil / Pegawai Utama*' }).fill(representativeName);
  await page.getByRole('textbox', { name: 'No. Pengenalan*' }).click();
  await page.getByRole('textbox', { name: 'No. Pengenalan*' }).fill(representativeIc);
  await page.getByRole('textbox', { name: 'Jawatan*' }).click();
  await page.getByRole('textbox', { name: 'Jawatan*' }).fill('IMAm');
  await page.getByRole('textbox', { name: 'No. Telefon*' }).click();
  await page.getByRole('textbox', { name: 'No. Telefon*' }).fill(representativePhone);
  await page.getByRole('textbox', { name: 'Emel*' }).click();
  await page.getByRole('textbox', { name: 'Emel*' }).fill(representativeEmail);
  await page.getByRole('button', { name: 'Pilih Fail' }).click();
  await page.getByRole('button', { name: 'Pilih Fail' }).click();
  await uploadFile(page.locator('input[type="file"]').first());
  await page.getByRole('button', { name: 'Seterusnya' }).click();
  await page.getByText('Sila Pilih').first().click();
  await page.locator('span').filter({ hasText: 'AFFIN BANK BERHAD' }).first().click();
  await page.getByRole('textbox', { name: 'Nombor Akaun Bank*' }).click();
  await page.getByRole('textbox', { name: 'Nombor Akaun Bank*' }).fill('87585878778');
  await page.getByText('Sila Pilih').click();
  await page.locator('span').filter({ hasText: 'TT' }).first().click();
  await page.getByRole('button', { name: 'Seterusnya' }).click();
  await page.getByRole('button', { name: 'Teruskan' }).click();
  await page.getByRole('button', { name: 'Pilih Fail' }).first().click();
  await uploadFile(page.locator('input[type="file"]').first());
  await page.getByRole('button', { name: 'Pilih Fail' }).nth(1).click();
  await uploadFile(page.locator('input[type="file"]').nth(2));
  await page.getByRole('button', { name: 'Pilih Fail' }).nth(2).click();
  await uploadFile(page.locator('input[type="file"]').nth(4));
  await page.getByRole('button', { name: 'Hantar' }).click();
  await page.getByRole('button', { name: 'Ya, Hantar' }).click();
  await page.getByRole('button', { name: 'Ya, Hantar' }).click();
  await page.waitForTimeout(2000);
await page.getByRole('button', { name: 'Log Keluar' }).click();

});