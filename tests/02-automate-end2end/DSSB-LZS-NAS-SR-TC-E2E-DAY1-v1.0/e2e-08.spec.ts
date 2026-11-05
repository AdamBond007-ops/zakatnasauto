import { test, expect, type Locator, type Page } from '@playwright/test';
import { faker } from '@faker-js/faker';
import path, { join } from 'path';
import { LoginAction } from '@library/2-object/Login/action';
import { CarianAsnafAction } from '@library/2-object/Carian Asnaf/action';
import { TIMEOUTS } from '../../library/1-data/config/timeout-config';
import { AduanAction } from '@library/2-object/Pendaftaran Lengkap/action';
import { STATUS_PEKERJAAN } from '@library/2-object/Pendaftaran Lengkap/data';
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

function generateMalaysianIc(): string {
  const birthDate = faker.date.birthdate({ min: 19, max: 65, mode: 'age' });
  const datePart = `${String(birthDate.getFullYear()).slice(-2)}${String(birthDate.getMonth() + 1).padStart(2, '0')}${String(birthDate.getDate()).padStart(2, '0')}`;
  const stateCode = String(faker.number.int({ min: 1, max: 16 })).padStart(2, '0');
  const serialNumber = `${faker.string.numeric(3)}${faker.helpers.arrayElement(['1', '3', '5', '7', '9'])}`;
  return `${datePart}${stateCode}${serialNumber}`;
}

function generateApplicantName(): string {
  return `END AUTO ${faker.lorem.word()}`;
}

function generateMalaysianPhoneNumber(): string {
  const prefix = faker.helpers.arrayElement(['010', '011', '012', '013', '014', '016', '017', '018', '019']);
  return `${prefix}${faker.string.numeric(prefix === '011' ? 8 : 7)}`;
}

function generateEmail(): string {
  return `shafiyadam83+${faker.string.numeric(7)}@gmail.com`;
}

function generateBankAccountNumber(): string {
  return faker.string.numeric(15);
}

async function drawStraightLine(page: Page, startX: number, startY: number, endX: number, endY: number): Promise<void> {
  const canvas = page.locator('canvas');
  const bounds = await canvas.boundingBox();
  if (!bounds) {
    throw new Error('Signature canvas is not visible');
  }

  await page.mouse.move(bounds.x + startX, bounds.y + startY);
  await page.mouse.down();
  await page.mouse.move(bounds.x + endX, bounds.y + endY, { steps: 20 });
  await page.mouse.up();
}

const TESTING_PDF = path.join(__dirname, '../../library/1-data/files/testing.pdf');

test('test', async ({ page }) => {
  const aduan = new AduanAction(page);
  const applicantIc = generateMalaysianIc();
  const applicantName = generateApplicantName();
  const applicantPhone = generateMalaysianPhoneNumber();
  const applicantEmail = generateEmail();
  const bankAccountNumber = generateBankAccountNumber();
  console.log('Generated applicant name:', applicantName);


    //EKP Login dan daftar baru asnaf
  await page.goto('https://stg.nas-internal.com/profiling/asnaf/carian-profil/lihat/4348faf5-d758-11f1-b54a-0615d51725e3?isRekod=true');

  await page.getByRole('textbox', { name: 'ID Pengguna' }).click();
  await page.getByRole('textbox', { name: 'ID Pengguna' }).fill('abdwalid');
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).click();
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).fill('Password123@');
  await page.getByRole('button', { name: 'Log Masuk', exact: true }).click();
  await page.locator('a').filter({ hasText: 'Carian Asnaf' }).click();
  await page.locator('div').filter({ hasText: /^Sila Pilih$/ }).click();
  await page.getByRole('option', { name: 'MyKad / MyKid' }).click();
  await page.locator('.formkit-inner.formkit-inner-text').first().click();
  await page.getByRole('textbox', { name: 'No. Pengenalan' }).fill(applicantIc);
  await page.getByRole('textbox', { name: 'Nama' }).click();
  await page.getByRole('textbox', { name: 'Nama' }).fill(applicantName);
  await page.getByRole('button', { name: 'Cari' }).click();
  await page.getByRole('button', { name: 'Isi Borang Permohonan' }).click();
  await page.getByRole('button', { name: 'Daftar tanpa Validasi' }).click();
  await uploadFile(page.locator('input[type="file"]').first());
  await page.getByRole('textbox', { name: 'Tempat Lahir' }).click();
  await page.getByRole('textbox', { name: 'Tempat Lahir' }).fill('PUCHONh');
  await page.getByText('Sila Pilih').first().click();
  await page.locator('span').filter({ hasText: 'Melayu' }).first().click();
  await page.getByRole('textbox', { name: 'No. Telefon Bimbit*' }).click();
  await page.getByRole('textbox', { name: 'No. Telefon Bimbit*' }).fill(applicantPhone);
  await page.getByRole('textbox', { name: 'Emel*' }).click();
  await page.getByRole('textbox', { name: 'Emel*' }).fill(applicantEmail);
  await page.getByText('Sila Pilih').first().click();
  await page.locator('span').filter({ hasText: 'Duda' }).first().click();
  await page.getByRole('textbox', { name: 'No Rumah / Lot / Blok*' }).click();
  await page.getByRole('textbox', { name: 'No Rumah / Lot / Blok*' }).fill('PUCONG129812');
  await page.getByRole('textbox', { name: 'Poskod*' }).click();
  await page.getByRole('textbox', { name: 'Poskod*' }).fill('46200');
  await page.waitForTimeout(TIMEOUTS.SHORT);
  await page.getByText('Sila Pilih').first().click();
  await page.getByRole('textbox', { name: 'Sila Pilih' }).fill('abu bakar');
  await page.locator('span').filter({ hasText: 'MASJID ABU BAKAR AS-SIDDIQ' }).first().click();
  await page.getByText('Sila Pilih').first().click();
  await page.locator('span').filter({ hasText: 'Tahun' }).first().click();
  await page.getByRole('spinbutton', { name: 'Tempoh Menetap di Selangor*' }).click();
  await page.getByRole('spinbutton', { name: 'Tempoh Menetap di Selangor*' }).fill('6');
  await page.getByText('Sila Pilih').first().click();
  await page.locator('span').filter({ hasText: 'Milik Sendiri Berbayar' }).first().click();
  await page.getByText('Sila Pilih').click();
  await page.locator('span').filter({ hasText: 'Separa Uzur' }).first().click();
  await page.getByRole('textbox', { name: 'Kadar Bayaran Bulanan jika' }).click();
  await page.getByRole('textbox', { name: 'Kadar Bayaran Bulanan jika' }).fill('300');
  await page.getByRole('button', { name: 'Seterusnya' }).click();
  await aduan.selectMuallaf('T');
    await aduan.selectMuflis('T');
    await aduan.selectAdaAkaunBank('Y');
  await page.getByText('Sila Pilih').click();
  await page.getByLabel('Nama Bank', { exact: true }).getByText('AFFIN BANK BERHAD').click();
  await page.getByRole('textbox', { name: 'No. Akaun Bank*' }).click();
  await page.getByRole('textbox', { name: 'No. Akaun Bank*' }).fill(bankAccountNumber);
  await uploadFile(page.locator('input[type="file"]').first());
  await page.getByRole('button', { name: 'Seterusnya' }).click();
  
      await page.waitForLoadState('load');
      await page.waitForTimeout(3000);
  
      await aduan.selectStatusPekerjaan(STATUS_PEKERJAAN.TIDAK_BEKERJA);

  await page.getByRole('button', { name: 'Teruskan Had Kifayah' }).click();
  await page.getByRole('row', { name: 'Dewasa Bekerja (18 Tahun ke Atas)' }).getByRole('spinbutton').click();
  await page.getByRole('row', { name: 'Dewasa Bekerja (18 Tahun ke Atas)' }).getByRole('spinbutton').fill('01');
  await page.getByRole('row', { name: '2. Dewasa Tidak Bekerja ( 18' }).getByRole('spinbutton').click();
  await page.getByRole('row', { name: '2. Dewasa Tidak Bekerja ( 18' }).getByRole('spinbutton').fill('01');
  await page.getByRole('button', { name: 'Seterusnya' }).click();
  await page.getByText('Daftar / Kemaskini /').click();
  await page.getByText('Memerlukan bantuan untuk').click();
  await uploadFile(page.locator('input[type="file"]').first());
  await page.getByRole('textbox', { name: 'Pernyataan Masalah*' }).click();
  await page.getByRole('textbox', { name: 'Pernyataan Masalah*' }).fill('macaalah');
  await page.getByRole('button', { name: 'Seterusnya' }).click();


  await page.getByRole('button', { name: 'Mohon Bantuan Baru' }).click();
  await page.getByText('Sila Pilih').first().click();
  await page.getByLabel('Aid', { exact: true }).getByText('(HQ) BANTUAN KEPERLUAN HIDUP').click();
  await page.getByText('Sila Pilih').first().click();
  await page.getByRole('option', { name: '(HQ) KATEGORI MAKAN/MINUM (' }).click();
  await page.locator('div').filter({ hasText: /^Sila Pilih$/ }).first().click();
  await page.getByRole('option', { name: '(HQ) KATEGORI MAKAN/MINUM (' }).click();
  await page.locator('.w-4.h-4.border').click();
  await page.getByRole('textbox', { name: 'Penyataan Sebab Permohonan' }).click();
  await page.getByRole('textbox', { name: 'Penyataan Sebab Permohonan' }).fill('maslaha nok');
  await page.getByRole('button', { name: 'Edit' }).click();
  await page.getByRole('textbox', { name: 'Kadar Bantuan (RM)*' }).click();
  await page.getByRole('textbox', { name: 'Kadar Bantuan (RM)*' }).fill('100');
  await page.locator('button').filter({ hasText: /^Simpan$/ }).click();
  await uploadFile(page.locator('input[type="file"]').nth(1));
  await uploadFile(page.locator('input[type="file"]').nth(2));
  await page.getByRole('textbox', { name: 'Nama/rujukan dokumen' }).click();
  await page.getByRole('textbox', { name: 'Nama/rujukan dokumen' }).fill('8282882');

  await page.getByRole('button', { name: 'Simpan' }).click();
  await page.getByRole('button', { name: 'Ya, Simpan' }).click();
  await page.getByRole('button', { name: 'OK' }).click();
  await page.getByRole('button', { name: 'Seterusnya', exact: true }).click();
  await aduan.pilihKakitanganLzs('T');
  await aduan.pilihPenolongAmil('T');
  await aduan.drawSignatureEOAD();
  await page.getByRole('button', { name: 'Hantar Permohonan' }).click();
  await page.waitForTimeout(TIMEOUTS.SHORT);
  await page.getByRole('button', { name: 'Log Keluar' }).click();

  //EOAD sokong

 
  await page.getByRole('textbox', { name: 'ID Pengguna' }).click();
  await page.getByRole('textbox', { name: 'ID Pengguna' }).fill('habibullah');
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).click();
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).fill('Password123@');
  await page.getByRole('button', { name: 'Log Masuk', exact: true }).click();
  await page.locator('a').filter({ hasText: 'Sokongan' }).click();
  await page.waitForTimeout(TIMEOUTS.SHORT);
  await page.getByRole('searchbox', { name: 'Cari...' }).click();
  await page.getByRole('searchbox', { name: 'Cari...' }).fill(applicantName);
  await page.getByRole('button', { name: 'Lihat Sokongan' }).click();
  await page.getByRole('button', { name: 'Maklumat Pemohon' }).click();
 await uploadFile(page.locator('input[type="file"]').first());
  await page.locator('#stepForm-1 div').filter({ hasText: /^Sila Pilih$/ }).click();
  await page.locator('span').filter({ hasText: 'Sihat' }).first().click();
  await page.getByRole('button', { name: 'Pendidikan & Kemahiran Belum' }).click();
  await aduan.pilihMasihBersekolah('02');
  await page.locator('#stepForm-2').getByText('Sila Pilih', { exact: true }).click();
  await page.locator('span').filter({ hasText: 'SPM' }).first().click();
  await uploadFile(page.locator('input[type="file"]').first());
  await aduan.pilihAdaKemahiran('Y');
  await page.getByRole('checkbox', { name: 'Nelayan' }).check();
  await page.getByRole('button', { name: 'Pinjaman & Aset Belum Selesai' }).click();
  await aduan.pilihAdaPinjaman('T');
  await aduan.pilihAdaAset('T');
  await page.waitForTimeout(TIMEOUTS.SHORT);
  
  await page.getByRole('button', { name: 'Tanggungan' }).click();
  await page.getByRole('button', { name: 'Simpan', exact: true }).click();
  await page.getByRole('button', { name: 'Status Asnaf' }).click();
  await page.getByRole('button', { name: 'Simpan', exact: true }).click();
  await page.getByRole('button', { name: 'Bantuan', exact: true }).click();
  await page.getByRole('button', { name: 'Lihat / Kemaskini' }).click();
  await page.waitForTimeout(TIMEOUTS.SHORT);
  await page.getByText('Sila Pilih', { exact: true }).click();
  await page.locator('span').filter({ hasText: 'Sokong' }).nth(1).click();
  await page.getByRole('textbox', { name: 'Catatan*' }).click();
  await page.getByRole('textbox', { name: 'Catatan*' }).fill('sokong');
  await page.getByRole('button', { name: 'Simpan' }).click();
  await page.locator('#kaedah-siasatan-form div').filter({ hasText: /^Sila Pilih$/ }).click();
  await page.locator('span').filter({ hasText: 'Lapangan' }).first().click();
  await page.getByRole('textbox', { name: 'Masa Siasatan*' }).fill('10:40');
  await uploadFile(page.locator('input[type="file"]').first());
  await page.getByRole('textbox', { name: 'Laporan Siasatan*' }).click();
  await page.getByRole('textbox', { name: 'Laporan Siasatan*' }).fill('kkjjk');
  await page.getByRole('radio', { name: 'Tandatangan Digital' }).check();
  await aduan.drawSignatureEOAD();
  await page.getByRole('button', { name: 'Sahkan Lawatan' }).click();
  await page.waitForTimeout(TIMEOUTS.SHORT);
  await page.getByRole('button', { name: 'Pengesahan' }).click();
  await uploadFileFromButton(page.getByRole('button', { name: 'Pilih Fail', exact: true }));
  await aduan.pilihSokongan('SOKONG');
  await page.getByRole('textbox', { name: 'Catatan*' }).click();
  await page.getByRole('textbox', { name: 'Catatan*' }).fill('sokong');
  await page.getByRole('button', { name: 'Hantar' }).click();
  await page.getByRole('button', { name: 'Ya, Hantar' }).click();
  await page.waitForTimeout(TIMEOUTS.SHORT);
  await page.getByRole('button', { name: 'OK' }).click();
  await page.waitForTimeout(TIMEOUTS.SHORT);
  await page.getByRole('button', { name: 'Log Keluar' }).click();

  //KOAD LUlus

  await page.getByRole('textbox', { name: 'ID Pengguna' }).click();
  await page.getByRole('textbox', { name: 'ID Pengguna' }).fill('m.sharil');
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).click();
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).fill('Password123@');
  await page.getByRole('button', { name: 'Log Masuk', exact: true }).click();
  await page.locator('a').filter({ hasText: 'Kelulusan' }).click();
  await page.waitForTimeout(TIMEOUTS.SHORT);
  await page.getByRole('searchbox', { name: 'Cari...' }).click();
  await page.getByRole('searchbox', { name: 'Cari...' }).fill(applicantName);
  await page.getByRole('button', { name: 'Lihat Kelulusan' }).first().click();
  await page.getByRole('button', { name: 'Bantuan', exact: true }).click();
  await page.getByRole('button', { name: 'Lihat / Tindakan' }).click();

  await page.waitForTimeout(TIMEOUTS.SHORT);
  await page.getByText('Sila Pilih', { exact: true }).click();
  await page.locator('span').filter({ hasText: 'Lulus' }).nth(3).click();
  await page.getByRole('textbox', { name: 'Catatan*' }).click();
  await page.getByRole('textbox', { name: 'Catatan*' }).fill('lulus');
  await page.getByRole('button', { name: 'Simpan' }).click();
  await page.getByRole('button', { name: 'Pengesahan' }).click();
  await page.waitForTimeout(TIMEOUTS.SHORT);
  await aduan.pilihKeputusan('LULUS');
  await page.getByRole('textbox', { name: 'Masukkan catatan kelulusan...' }).click();
  await page.getByRole('textbox', { name: 'Masukkan catatan kelulusan...' }).fill('lulus');
  await page.getByRole('button', { name: 'Hantar' }).click();
  await page.waitForTimeout(TIMEOUTS.SHORT);
  await page.getByRole('button', { name: 'Ya, Hantar' }).click();
  await page.waitForTimeout(TIMEOUTS.SHORT);
  await page.getByRole('button', { name: 'OK' }).click();
  await page.waitForTimeout(TIMEOUTS.SHORT);
  await page.getByRole('button', { name: 'Log Keluar' }).click();


  //KEMASKINI

  
   await page.getByRole('textbox', { name: 'ID Pengguna' }).click();
    await page.getByRole('textbox', { name: 'ID Pengguna' }).fill('abdwalid');
    await page.getByRole('textbox', { name: 'Kata Laluan*' }).click();
    await page.getByRole('textbox', { name: 'Kata Laluan*' }).fill('Password123@');
    await page.getByRole('button', { name: 'Log Masuk', exact: true }).click();
    await page.locator('a').filter({ hasText: 'Carian Asnaf' }).click();
    await page.getByRole('textbox', { name: 'Nama', exact: true }).click();
    await page.getByRole('textbox', { name: 'Nama', exact: true }).fill(applicantName);
    await page.getByRole('button', { name: 'Cari' }).click();
    await page.waitForTimeout(TIMEOUTS.SHORT);
    
    await page.getByRole('button', { name: 'Lihat Profil' }).first().click();
    await page.getByRole('button', { name: 'Kemaskini' }).click();
    await page.getByRole('button', { name: 'Ya, Kemaskini' }).click();
  
    await page.getByText('Daftar / Kemaskini /').click();
    await page.locator('label').filter({ hasText: 'Pendaftaran baharu atau' }).click();
    await uploadFile(page.locator('input[type="file"]').first());
    await page.getByRole('textbox', { name: 'Pernyataan Masalah*' }).click();
    await page.getByRole('textbox', { name: 'Pernyataan Masalah*' }).fill('masalah');
    await page.getByRole('button', { name: 'Seterusnya', exact: true }).click();
    await page.getByRole('button', { name: 'Status Asnaf' }).click();
    await page.locator('span').filter({ hasText: 'Aktif' }).click();
    await page.locator('span').filter({ hasText: 'Keluar Selangor' }).first().click();
    await page.getByRole('button', { name: 'Simpan' }).click();
    await page.waitForTimeout(TIMEOUTS.SHORT);
    await page.getByRole('button', { name: 'Pengesahan', exact: true }).click();
    await page.getByRole('button', { name: 'Pengesahan Akhir Belum' }).click();
    await page.locator('[data-test="pengesahan-method-toggle"]').getByText('Tidak Memerlukan Tanda tangan').click();
    await page.getByRole('button', { name: 'Hantar Permohonan' }).click();
    await page.getByRole('button', { name: 'Ya, Hantar' }).click();
    await page.getByRole('button', { name: 'OK' }).click();
    
      await page.getByRole('button', { name: 'Log Keluar' }).click();
  
    //EOAD
   
    await page.getByRole('textbox', { name: 'ID Pengguna' }).click();
    await page.getByRole('textbox', { name: 'ID Pengguna' }).fill('habibullah');
    await page.getByRole('textbox', { name: 'Kata Laluan*' }).click();
    await page.getByRole('textbox', { name: 'Kata Laluan*' }).fill('Password123@');
    await page.getByRole('button', { name: 'Log Masuk', exact: true }).click();
    await page.locator('a').filter({ hasText: 'Sokongan' }).click();
    await page.waitForTimeout(TIMEOUTS.LONG);
  await page.getByRole('searchbox', { name: 'Cari...' }).click();
  await page.getByRole('searchbox', { name: 'Cari...' }).fill(applicantName);
    
    await page.getByRole('button', { name: 'Lihat Sokongan' }).first().click();
    await page.getByRole('button', { name: 'Status Asnaf' }).click();
    await page.getByRole('button', { name: 'Pengesahan' }).click();
    await page.locator('div').filter({ hasText: /^Sokong$/ }).click();
    await page.getByRole('option', { name: 'Sokong' }).click();
    await page.getByRole('textbox', { name: 'Catatan*' }).click();
    await page.getByRole('textbox', { name: 'Catatan*' }).fill('sokong');
    await page.getByRole('button', { name: 'Hantar' }).click();
    await page.getByRole('button', { name: 'Ya, Hantar' }).click();
    await page.waitForTimeout(TIMEOUTS.SHORT);
    await page.getByRole('button', { name: 'OK' }).click();
    await page.waitForTimeout(TIMEOUTS.SHORT);
    await page.getByRole('button', { name: 'Log Keluar' }).click();
  
  
    //KOAD
    
    await page.getByRole('textbox', { name: 'ID Pengguna' }).click();
    await page.getByRole('textbox', { name: 'ID Pengguna' }).fill('m.sharil');
    await page.getByRole('textbox', { name: 'Kata Laluan*' }).click();
    await page.getByRole('textbox', { name: 'Kata Laluan*' }).fill('Password123@');
    await page.getByRole('button', { name: 'Log Masuk', exact: true }).click();
    await page.locator('a').filter({ hasText: 'Kelulusan' }).click();
    await page.waitForTimeout(TIMEOUTS.LONG);
  
    await page.getByRole('searchbox', { name: 'Cari...' }).click();
  await page.getByRole('searchbox', { name: 'Cari...' }).fill(applicantName);
    await page.getByRole('button', { name: 'Lihat Kelulusan' }).first().click();
    await page.waitForTimeout(TIMEOUTS.SHORT);
    await aduan.pilihKeputusan('LULUS');
    await page.getByRole('textbox', { name: 'Masukkan catatan kelulusan...' }).click();
    await page.getByRole('textbox', { name: 'Masukkan catatan kelulusan...' }).fill('lulus');
    await page.getByRole('button', { name: 'Hantar' }).click();
    await page.getByRole('button', { name: 'Ya, Hantar' }).click();
    await page.getByRole('button', { name: 'OK' }).click();

});
