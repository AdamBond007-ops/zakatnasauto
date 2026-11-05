import { test, expect, type Locator } from '@playwright/test';
import { faker } from '@faker-js/faker';
import path, { join } from 'path';

function generateApplicantName(): string {
  return `END AUTO AMIL ${faker.lorem.word()}`;
}

function generateMalaysianIc(): string {
  const birthDate = faker.date.birthdate({ min: 19, max: 65, mode: 'age' });
  const datePart = `${String(birthDate.getFullYear()).slice(-2)}${String(birthDate.getMonth() + 1).padStart(2, '0')}${String(birthDate.getDate()).padStart(2, '0')}`;
  const stateCode = String(faker.number.int({ min: 1, max: 16 })).padStart(2, '0');
  const serialNumber = `${faker.string.numeric(3)}${faker.helpers.arrayElement(['1', '3', '5', '7', '9'])}`;
  return `${datePart}${stateCode}${serialNumber}`;
}

function generateMalaysianPhoneNumber(): string {
  const prefix = faker.helpers.arrayElement(['010', '011', '012', '013', '014', '016', '017', '018', '019']);
  return `${prefix}${faker.string.numeric(prefix === '011' ? 8 : 7)}`;
}

function generateEmail(): string {
  return `shafiyadam83+${faker.string.numeric(7)}@gmail.com`;
}

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
  const applicantName = generateApplicantName();
  const applicantIc = generateMalaysianIc();
  const applicantPhone = generateMalaysianPhoneNumber();
  const applicantEmail = generateEmail();

    //PIC
  await page.goto('https://stg.nas-internal.com/login');
  await page.getByRole('textbox', { name: 'ID Pengguna' }).click();
  await page.getByRole('textbox', { name: 'ID Pengguna' }).fill('960318561000');
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).click();
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).fill('Password123@');
  await page.getByRole('button', { name: 'Log Masuk', exact: true }).click();
  await page.locator('a').filter({ hasText: 'Pendaftaran Penolong Amil' }).click();
  await page.getByRole('button', { name: 'Tambah' }).click();
  await page.getByRole('button', { name: 'Individu' }).click();
  await page.getByRole('textbox', { name: 'No. MyKad (cth: 900101011234)' }).click();
  await page.getByRole('textbox', { name: 'No. MyKad (cth: 900101011234)' }).fill(applicantIc);
  await page.getByRole('textbox', { name: 'Nama Penuh*' }).click();
  await page.getByRole('textbox', { name: 'Nama Penuh*' }).fill(applicantName);
  await page.getByRole('textbox', { name: 'Emel*' }).click();
  await page.getByRole('textbox', { name: 'Emel*' }).fill(applicantEmail);
  await page.getByRole('textbox', { name: 'No. Telefon*' }).click();
  await page.getByRole('textbox', { name: 'No. Telefon*' }).fill(applicantPhone);
  await page.getByText('Sila Pilih').nth(1).click();
  await page.locator('span').filter({ hasText: 'Kariah (PAK)' }).first().click();
  await page.getByText('Sila Pilih', { exact: true }).click();
  await page.getByRole('listbox').getByText('Ketua Penolong Amil kariah').click();
  await page.getByRole('button', { name: 'Tambah Lantikan' }).click();
  await uploadFile(page.locator('input[type="file"]').first());
  await page.getByRole('button', { name: 'Tambah Calon' }).click();
  await page.getByRole('button', { name: 'OK' }).click();
  await page.getByLabel('', { exact: true }).check();
  await uploadFile(page.locator('input[type="file"]').first());
  await page.getByRole('button', { name: 'Hantar' }).click();
  await page.getByRole('button', { name: 'Setuju & Hantar' }).click();
  await page.waitForTimeout(3000);
  await page.getByRole('button', { name: 'OK' }).click();
  await page.getByRole('button', { name: 'Log Keluar' }).click();


  //PTDPA

  await page.getByRole('textbox', { name: 'ID Pengguna' }).click();
  await page.getByRole('textbox', { name: 'ID Pengguna' }).fill('zakatselsyafiq.ramli');
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).click();
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).fill('Password123@');
  await page.getByRole('button', { name: 'Log Masuk', exact: true }).click();
  await page.getByRole('button', { name: 'Tukar Peranan' }).click();
  await page.getByRole('menuitem', { name: 'PT_PA' }).click();
  await page.locator('a').filter({ hasText: 'Pendaftaran Penolong Amil' }).click();
  await page.getByRole('searchbox', { name: 'Cari...' }).click();
  await page.getByRole('searchbox', { name: 'Cari...' }).fill(applicantName);
  await page.getByRole('button', { name: 'Lihat' }).click();
  await page.getByRole('combobox').selectOption('200');
  await page.getByRole('textbox', { name: 'Masukkan catatan untuk' }).click();
  await page.getByRole('textbox', { name: 'Masukkan catatan untuk' }).fill('lengkap');
  await page.getByRole('button', { name: 'Hantar' }).click();
  await page.getByRole('button', { name: 'Ya, Hantar' }).click();
});
