import { test, expect, Page } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { faker } from '@faker-js/faker';
import { TIMEOUTS } from '../../library/1-data/config/timeout-config';

async function logout(page: Page) {
  await page.waitForTimeout(5000);
  await page.getByRole('button', { name: 'Log Keluar' }).click();
}

function generateIC() {
  // Random birth date
  const birthDate = faker.date.birthdate({
    min: 18,
    max: 70,
    mode: 'age',
  });

  // YYMMDD
  const yy = birthDate.getFullYear().toString().slice(-2);
  const mm = String(birthDate.getMonth() + 1).padStart(2, '0');
  const dd = String(birthDate.getDate()).padStart(2, '0');

  // State code (01-14)
  const stateCode = String(faker.number.int({ min: 1, max: 14 })).padStart(2, '0');

  // Last 4 digits
  const randomDigits = String(
    faker.number.int({ min: 0, max: 9999 })
  ).padStart(4, '0');

  return `${yy}${mm}${dd}${stateCode}${randomDigits}`;
}

const firstName = faker.person.firstName();

const data = {
  name: `MAZ ${firstName}`,
  ic: generateIC(),
  email: `maz.${firstName.toLowerCase()}${faker.number.int({ min: 100, max: 999 })}@gmail.com`,
  phone: '0120101001',
  address: 'F-3-4',
};

function getFirstUploadFile(): string {

  const repoFile = path.resolve(__dirname, '../../library/1-data/files/testing.pdf');

  if (fs.existsSync(repoFile)) {
    return repoFile;
  }
  const possiblePaths = [
    'D:\\Downloads',
    'C:\\Download'
  ];

  let files: string[] = [];

  const downloadPath = possiblePaths.find(p => {
    if (fs.existsSync(p)) {
      const f = fs.readdirSync(p);
      if (f.length > 0) {
        files = f;
        return true;
      }
    }
    return false;
  });

  if (!downloadPath) {
    throw new Error('No valid upload file found (repo file missing and no local Downloads folder found)');
  }

  const file = files.find(f =>
    f.endsWith('.pdf') ||
    f.endsWith('.doc') ||
    f.endsWith('.docx') ||
    f.endsWith('.zip')
  );

  if (!file) throw new Error('No uploadable file found');

  return path.join(downloadPath, file);
}

async function uploadFileForLabeledRow(
  page: Page,
  rowLabel: string,
  filePath: string
) {
  const row = page.locator('div.grid.items-center', {
    has: page.getByText(rowLabel, { exact: true }),
  });

  await row.locator('input[type="file"]').setInputFiles(filePath);
}

async function selectFromDropdown(page: Page, fieldName: string, optionText: string): Promise<void> {
  await page.locator(`[name="${fieldName}"]`)
    .locator('..')
    .locator('.select-trigger')
    .click();

  // Click the matching option in the opened list
  await page.getByRole('option', { name: optionText, exact: true }).click();

  await page.waitForTimeout(500);
}

async function selectFromDropdownByLabel(page: Page, labelText: string, optionText: string) {
  // Open the dropdown by clicking its trigger, scoped to the field's wrapper
  const field = page.locator('.formkit-wrapper', { hasText: labelText }).first();
  await field.locator('.select-trigger').click();
  await page.waitForTimeout(1000);

  // The panel is portaled to <body> with role="listbox" and aria-label matching the field label
  const listbox = page.getByRole('listbox').filter({ visible: true }).first();
  await listbox.waitFor({ state: 'visible', timeout: 5000 });
  await page.waitForTimeout(3000);

  // Select the exact option
  const option = listbox.getByRole('option', { name: optionText, exact: true });

  // Fail fast with a clear message instead of a silent 30s timeout
  if (await option.count() === 0) {
    const available = await listbox.getByRole('option').allTextContents();
    throw new Error(
      `Option "${optionText}" not found for field "${labelText}".\nAvailable options:\n${available.join('\n')}`
    );
  }

  await option.click();
  await page.waitForTimeout(500);
}

async function fillInputByLabel(page: Page, labelText: string, value: string | number) {
  // Scope to the field's wrapper using the visible label text
  const field = page.locator('.formkit-outer', { hasText: labelText }).first();

  // Get the associated input via the label's "for" attribute, to avoid
  // accidentally matching a wrong nested input
  const label = field.locator('.formkit-label', { hasText: labelText }).first();
  const inputId = await label.getAttribute('for');

  if (!inputId) {
    throw new Error(`Could not resolve input id for label "${labelText}"`);
  }

  const input = page.locator(`#${inputId}`);

  await input.waitFor({ state: 'visible', timeout: 5000 });
  await input.click();
  await input.fill(String(value));

  // Optional: verify the value actually landed (FormKit fields sometimes
  // intercept input and reformat/clear on blur)
  await input.blur();
  const actual = await input.inputValue();
  if (actual !== String(value)) {
    throw new Error(
      `Value mismatch for field "${labelText}": expected "${value}", got "${actual}"`
    );
  }
}

// Reusable function for FormKit radio button groups
// Matches inputs like: <input type="radio" name="adakah_muallaf" id="input_359-option-t" value="T">
async function selectRadioByValue(page: Page, name: string, value: string) {
  await page.locator(`input[type="radio"][name="${name}"][value="${value}"]`).check();
}

async function selectCheckboxByValue(page: Page, name: string, value: string) {
  await page.locator(`input[type="checkbox"][name="${name}"][value="${value}"]`).check();
}

test('TC Daftar baru FM Ekspress', async ({ page }) => {
  test.setTimeout(TIMEOUTS.TEN_MINUTES)

  // ------------------------------------------------
  //        EKP1
  // ------------------------------------------------

  await page.goto('https://stg.nas-internal.com/login');
  await page.getByRole('textbox', { name: 'ID Pengguna' }).click();
  await page.getByRole('textbox', { name: 'ID Pengguna' }).fill('suziela');
  await page.getByRole('textbox', { name: 'ID Pengguna' }).press('Tab');
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).fill('Password123@');
  await page.getByRole('button', { name: 'Log Masuk', exact: true }).click();
  await page.waitForTimeout(1000);
  await page.locator('a').filter({ hasText: 'Carian Asnaf' }).click();
  await page.waitForTimeout(1000);
  await page.locator('div').filter({ hasText: /^Sila Pilih$/ }).click();

  await page.getByRole('option', { name: 'MyKad / MyKid' }).click();
  await page.getByRole('textbox', { name: 'No. Pengenalan' }).click();
  await page.getByRole('textbox', { name: 'No. Pengenalan' }).fill(data.ic);
  await page.getByRole('textbox', { name: 'Nama' }).click();
  await page.getByRole('textbox', { name: 'Nama' }).fill(data.name);
  await page.getByRole('button', { name: 'Cari' }).click();
  await page.getByText('Tiada profil ditemui dengan').click();
  await page.getByRole('button', { name: 'Isi Borang Permohonan' }).click();
  await page.getByRole('button', { name: 'Daftar tanpa Validasi' }).click();
  await page.waitForTimeout(5000);

  // ------------------------------------------------
  //        MAKLUMAT PERIBADI
  // ------------------------------------------------

  await page.getByRole('textbox', { name: 'Nama*' }).click();
  await page.getByRole('textbox', { name: 'Nama*' }).fill('');
  await page.getByRole('textbox', { name: 'Nama*' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Nama*' }).fill(data.name);

  const filePath = getFirstUploadFile();
  const fileInput1 = page.locator('#stepForm-1 input[type="file"]');
  await fileInput1.setInputFiles(filePath);
  await page.waitForTimeout(1000);

  // Jantina — pick ONE value only
  await selectFromDropdown(page, 'jantina', 'Lelaki');

  // Bangsa
  await selectFromDropdown(page, 'bangsa', 'Melayu');

  // Phone
  await page.getByRole('textbox', { name: 'No. Telefon Bimbit*' }).fill(data.phone);

  // Email
  await page.getByRole('textbox', { name: 'Emel*' }).fill(data.email);

  await page.waitForTimeout(1000);

  await page.getByText('Status Perkahwinan*Sila').click();
  await page.getByRole('textbox', { name: 'Sila Pilih' }).click();
  await page.getByLabel('Status Perkahwinan', { exact: true }).getByText('Bujang').click();
  await page.getByRole('textbox', { name: 'No Rumah / Lot / Blok*' }).click();
  await page.getByRole('textbox', { name: 'No Rumah / Lot / Blok*' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'No Rumah / Lot / Blok*' }).fill('F-3-4');
  await page.getByRole('textbox', { name: 'Poskod*' }).click();
  await page.getByRole('textbox', { name: 'Poskod*' }).fill('41000');
  await page.getByText('Kariah*').click();
  await page.getByText('Sila Pilih').first().click();
  await page.getByLabel('Kariah', { exact: true }).getByText('MASJID AHMADI RANTAU PANJANG').first().click();
  await page.getByRole('spinbutton', { name: 'Tempoh Menetap di Selangor*' }).click();
  await page.getByRole('spinbutton', { name: 'Tempoh Menetap di Selangor*' }).fill('1');
  await page.getByText('Tempoh*').click();
  await page.locator('div').filter({ hasText: /^Sila Pilih$/ }).first().click();
  await page.getByLabel('Tempoh', { exact: true }).getByText('Tahun', { exact: true }).click();
  await page.waitForTimeout(1000);

  await page.getByText('Status kediaman Tempat').click();
  await page.locator('div').filter({ hasText: /^Sila Pilih$/ }).first().click();
  await page.getByLabel('Status kediaman Tempat Tinggal', { exact: true }).getByText('Milik Sendiri Berbayar').click();
  await page.getByText('Keadaan Kediaman*').click();
  await page.locator('div').filter({ hasText: /^Sila Pilih$/ }).click();
  await page.getByLabel('Keadaan Kediaman', { exact: true }).getByText('Baik/Sempurna').click();
  await page.getByRole('textbox', { name: 'Kadar Bayaran Bulanan jika' }).click();
  await page.getByRole('textbox', { name: 'Kadar Bayaran Bulanan jika' }).fill('700');
  await page.getByRole('button', { name: 'Seterusnya' }).click();
  await page.waitForTimeout(500);

  // ------------------------------------------------
  //        PENGISLAMAN DAN PERBANKAN
  // ------------------------------------------------

  await selectRadioByValue(page, 'adakah_muallaf', 'T');

  await selectRadioByValue(page, 'muflis_disenarai_hitam', 'T');

  await selectRadioByValue(page, 'ada_akaun_bank', 'Y');

  await selectFromDropdown(page, 'bank0NamaBank', 'AFFIN BANK BERHAD');

  await page.getByRole('textbox', { name: 'No. Akaun Bank*' }).click();

  await page.getByRole('textbox', { name: 'No. Akaun Bank*' }).fill('210391230129310');

  const fileInput2 = page.locator('#stepForm-2 input[type="file"]');
  await fileInput2.setInputFiles(filePath);
  await page.waitForTimeout(1000);

  await page.getByRole('button', { name: 'Seterusnya' }).click();
  await page.waitForTimeout(1000);

  // ------------------------------------------------
  //        PEKERJAAN PENDAPATAN DAN PERBELANJAAN
  // ------------------------------------------------

  await page.locator('label').filter({ hasText: 'Tidak Bekerja' }).click();

  // ------------------------------------------------
  //        JADUAL HAD KIFAYAH
  // ------------------------------------------------

  await page.getByRole('button', { name: 'Teruskan Had Kifayah' }).click();

  await page.getByRole('button', { name: 'Seterusnya' }).click();
  await page.waitForTimeout(1000);

  // ------------------------------------------------
  //        PENILAIAN AWAL
  // ------------------------------------------------

  await page.getByText('Kuning : Terputus bekalan').click();

  await page.locator('label').filter({ hasText: 'Pendapatan tidak mencukupi' }).click();

  await page.getByRole('textbox', { name: 'Pernyataan Masalah *' }).click();

  await page.getByRole('textbox', { name: 'Pernyataan Masalah *' }).fill('Masalah');

  await page.getByRole('button', { name: 'Seterusnya' }).click();
  await page.waitForTimeout(1000);

  // ------------------------------------------------
  //        BANTUAN
  // ------------------------------------------------



  await page.getByRole('button', { name: 'Mohon Bantuan Baru' }).click();
  await page.waitForTimeout(5000);

  await selectFromDropdownByLabel(page, 'Aid', 'BANTUAN KEWANGAN BULANAN (FAKIR)');
  await selectFromDropdownByLabel(page, 'Aid Product', 'BANTUAN KEWANGAN BULANAN (FAKIR)');
  await selectFromDropdownByLabel(page, 'Product Package', 'KEWANGAN BULANAN (FAKIR) - TT');

  await page.locator('label[for^="entitlement-"]').click();
  //await page.getByText('KEWANGAN BULANAN (FAKIR) - TT').nth(0).click();

  //await page.locator('label').filter({ hasText: 'Cash Counter/Lapangan' }).click();
  await page.getByRole('textbox', { name: 'Penyataan Masalah*' }).click();
  await page.getByRole('textbox', { name: 'Penyataan Masalah*' }).fill('Masalah');
  await page.getByRole('button', { name: 'Edit' }).click();

  await fillInputByLabel(page, 'Tempoh/Kekerapan', 12);

  await selectFromDropdownByLabel(page, 'Kategori Penerima', 'Asnaf');
  await selectFromDropdownByLabel(page, 'Kaedah Pembayaran', 'EFT');

  const modal = page.locator('.modal.modal-top');
  await modal.waitFor({ state: 'visible' });

  // Scope Simpan to *inside* the modal specifically
  await modal.getByRole('button', { name: 'Simpan', exact: true }).click();

  const filePath3 = getFirstUploadFile();
  await uploadFileForLabeledRow(page, 'Pengesahan Pendapatan', filePath3);
  await page.waitForTimeout(5000);

  await page.getByRole('button', { name: 'Simpan' }).click();
  await page.getByRole('button', { name: 'Ya, Simpan' }).click();
  await page.getByRole('button', { name: 'OK' }).click();
  await page.getByRole('button', { name: 'Seterusnya' }).click();


  // ------------------------------------------------
  //        PENGESAHAN
  // ------------------------------------------------

  await selectRadioByValue(page, 'hubungan_kakitangan_lzs', 'T');
  await selectRadioByValue(page, 'hubungan_penolong_amil', 'T');

  await selectCheckboxByValue(page, 'pdpa_consent', 'true');

  //await selectFromDropdownByLabel(page, 'Nama Pegawai', 'SUZIELA BINTI AZIZ');

  await page.getByRole('button', { name: 'Hantar Permohonan' }).click();

  await page.waitForTimeout(7000);

  await logout(page);

  // ------------------------------------------------
  //        EOAD KLANG
  // ------------------------------------------------

  await page.getByRole('textbox', { name: 'ID Pengguna' }).click();
  await page.getByRole('textbox', { name: 'ID Pengguna' }).fill('ZAKATSELansarullah.durai');
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).click();
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).fill('Password123@');
  await page.getByRole('button', { name: 'Log Masuk', exact: true }).click();
  await page.waitForTimeout(3000);

  await page.locator('a').filter({ hasText: 'Sokongan' }).click();
  await page.waitForTimeout(3000);

  await page.getByRole('searchbox', { name: 'Cari...' }).click();
  await page.getByRole('searchbox', { name: 'Cari...' }).fill(data.ic);
  await page.getByRole('cell', { name: data.ic }).click();
  await page.waitForTimeout(3000);

  await page.getByRole('button', { name: 'Togol senarai bahagian belum' }).click();
  await page.waitForTimeout(3000);

  await page.getByRole('button', { name: 'Pergi ke Peribadi, Perbankan' }).click();
  await page.waitForTimeout(3000);

  await selectFromDropdown(page, 'tahap_kesihatan', 'Sihat');

  await page.getByRole('button', { name: 'Pergi ke Pendidikan &' }).click();
  await page.waitForTimeout(3000);

  await selectRadioByValue(page, 'masih_bersekolah', '02');

  await selectFromDropdown(page, 'pendidikan_tertinggi', 'SPM');

  await selectRadioByValue(page, 'ada_kemahiran', 'T');

  await page.getByRole('button', { name: 'Pergi ke Pinjaman & Aset — 2' }).click();
  await page.waitForTimeout(3000);

  await selectRadioByValue(page, 'ada_pinjaman', 'T');

  await selectRadioByValue(page, 'ada_aset', 'T');

  await page.getByRole('button', { name: 'Pergi ke Pengesahan Bermastautin — 1 medan belum lengkap' }).click();
  await page.waitForTimeout(3000);

  await page.getByRole('button', { name: 'Simpan' }).click();
  await page.waitForTimeout(5000);

  const fileInput3 = page.getByRole('main').locator('input[type="file"]');
  await fileInput3.setInputFiles(filePath);
  await page.waitForTimeout(3000);

  await page.getByRole('button', { name: 'Pergi ke Kaedah Siasatan' }).click();
  await page.waitForTimeout(3000);

  await selectFromDropdownByLabel(page, 'Kaedah Siasatan', 'Lapangan');

  await page.getByRole('textbox', { name: 'Laporan Siasatan*' }).click();
  await page.getByRole('textbox', { name: 'Laporan Siasatan*' }).fill('Laporan');

  await page.locator('div.formkit-wrapper', { has: page.locator('label', { hasText: 'Masa Siasatan' }) })
    .locator('input[type="time"]')
    .fill('14:30');

  await page.waitForTimeout(3000);

  await page.locator('input[type="radio"][value="tandatangan"]').click();

  await page.waitForTimeout(1000);

  async function fakeSignature(page: Page) {
    const canvas = page.locator('div.border-dashed canvas');
    await canvas.waitFor({ state: 'visible' });

    await canvas.evaluate((el: HTMLCanvasElement) => {
      const ctx = el.getContext('2d')!;
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(50, 50);
      ctx.lineTo(300, 150);
      ctx.lineTo(500, 80);
      ctx.stroke();

      const rect = el.getBoundingClientRect();
      const fire = (type: string, x: number, y: number) => {
        el.dispatchEvent(new PointerEvent(type, {
          bubbles: true,
          cancelable: true,
          clientX: rect.left + x,
          clientY: rect.top + y,
          pointerId: 1,
          pointerType: 'mouse',
          buttons: type === 'pointerup' ? 0 : 1,
        }));
      };
      fire('pointerdown', 50, 50);
      fire('pointermove', 300, 150);
      fire('pointerup', 500, 80);
    });
  }

  await fakeSignature(page);

  await page.getByRole('button', { name: 'Sahkan Lawatan' }).click();

  await page.getByRole('button', { name: 'Bantuan', exact: true }).click();
  await page.waitForTimeout(3000);

  // Scope to the row by matching the document name inside the "Maklumat Bantuan" cell
  function getRowByDocName(page: Page, docName: string) {
    return page.locator('tbody tr').filter({
      has: page.locator('.font-medium.text-gray-800', { hasText: docName })
    });
  }

  async function assertRowStatus(page: Page, docName: string, statusText: string) {
    const row = getRowByDocName(page, docName);
    const statusBadge = row.locator('.badge', { hasText: statusText });
    await expect(statusBadge).toBeVisible();
  }

  async function clickLihatKemaskini(page: Page, docName: string) {
    const row = getRowByDocName(page, docName);
    await row.locator('button[title="Lihat / Kemaskini"]').click();
  }

  // 2. Click Lihat / Kemaskini for the other two rows
  await clickLihatKemaskini(page, 'BANTUAN KEWANGAN BULANAN (FAKIR)');
  await page.waitForTimeout(3000);

  await selectFromDropdownByLabel(page, 'Status Siasatan', 'Sokong');
  await page.getByRole('textbox', { name: 'Catatan*' }).click();
  await page.getByRole('textbox', { name: 'Catatan*' }).fill('sada');
  await page.getByRole('button', { name: 'Simpan' }).click();
  await page.waitForTimeout(3000);

  await page.getByRole('button', { name: 'Togol senarai bahagian belum' }).click();
  await page.waitForTimeout(3000);

  await page.getByRole('button', { name: 'Pergi ke Pengesahan Akhir — 1' }).click();
  await page.waitForTimeout(3000);

  await selectCheckboxByValue(page, 'pdpa_consent', 'true');

  await selectFromDropdownByLabel(page, 'Kategori Asnaf', 'Fakir');

  await selectFromDropdownByLabel(page, 'Kategori Individu', 'Fakir');

  await selectFromDropdownByLabel(page, 'Sokongan', 'Sokong');

  await page.getByRole('textbox', { name: 'Catatan*' }).click();
  await page.getByRole('textbox', { name: 'Catatan*' }).fill('sokong');

  await page.getByRole('button', { name: 'Hantar' }).click();
  await page.waitForTimeout(1000);

  await page.getByRole('button', { name: 'Ya, Hantar' }).click();
  await page.waitForTimeout(2000);

  await page.getByRole('button', { name: 'OK' }).click();
  await page.waitForTimeout(5000);

  await logout(page);

  // ------------------------------------------------
  //        KOAD KLANG
  // ------------------------------------------------

  async function clickLihatTindakan(page: Page, docName: string) {
    const row = getRowByDocName(page, docName);
    await row.locator('button[title="Lihat / Tindakan"]').click();
  }

  await page.getByRole('textbox', { name: 'ID Pengguna' }).click();
  await page.getByRole('textbox', { name: 'ID Pengguna' }).fill('ZAKATSELhairol.azmi');
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).click();
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).fill('Password123@');
  await page.getByRole('button', { name: 'Log Masuk', exact: true }).click();
  await page.waitForTimeout(3000);

  await page.locator('a').filter({ hasText: 'Kelulusan' }).click();
  await page.waitForTimeout(3000);

  await page.getByRole('searchbox', { name: 'Cari...' }).click();
  await page.getByRole('searchbox', { name: 'Cari...' }).fill(data.ic);
  await page.getByRole('cell', { name: data.ic }).click();
  await page.waitForTimeout(3000);

  await page.getByRole('button', { name: 'Bantuan', exact: true }).click();

  await clickLihatTindakan(page, 'BANTUAN KEWANGAN BULANAN (FAKIR)');
  await page.waitForTimeout(5000);

  await selectFromDropdownByLabel(page, 'Status Kelulusan', 'Lulus');
  await page.getByRole('textbox', { name: 'Catatan*' }).click();
  await page.getByRole('textbox', { name: 'Catatan*' }).fill('sada');
  await page.getByRole('button', { name: 'Simpan' }).click();
  await page.waitForTimeout(3000);

  await selectFromDropdown(page, 'keputusan', 'Lulus');

  await page.getByRole('textbox', { name: 'Masukkan catatan kelulusan...' }).click();
  await page.getByRole('textbox', { name: 'Masukkan catatan kelulusan...' }).fill('lulus');

  await page.getByRole('button', { name: 'Hantar' }).click();
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: 'Ya, Hantar' }).click();
  await page.waitForTimeout(2000);
  await page.getByRole('button', { name: 'OK' }).click();
  await page.waitForTimeout(3000);

  await logout(page);

  // ------------------------------------------------
  //        EKP1
  // ------------------------------------------------

  await page.getByRole('textbox', { name: 'ID Pengguna' }).click();
  await page.getByRole('textbox', { name: 'ID Pengguna' }).fill('suziela');
  await page.getByRole('textbox', { name: 'ID Pengguna' }).press('Tab');
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).fill('Password123@');
  await page.getByRole('button', { name: 'Log Masuk', exact: true }).click();
  await page.waitForTimeout(1000);
  await page.locator('a').filter({ hasText: 'Carian Asnaf' }).click();
  await page.waitForTimeout(1000);
  await page.locator('div').filter({ hasText: /^Sila Pilih$/ }).click();

  await page.getByRole('option', { name: 'MyKad / MyKid' }).click();
  await page.getByRole('textbox', { name: 'No. Pengenalan' }).click();
  await page.getByRole('textbox', { name: 'No. Pengenalan' }).fill(data.ic);
  await page.getByRole('textbox', { name: 'Nama' }).click();
  await page.getByRole('textbox', { name: 'Nama' }).fill(data.name);
  await page.getByRole('button', { name: 'Cari' }).click();
  await page.waitForTimeout(5000);

  async function clickLihatProfilByIC(page: Page, icNumber: string) {
    const row = page.locator('tbody tr').filter({
      has: page.locator('span.font-medium', { hasText: new RegExp(`^${icNumber}$`) })
    });

    const viewButton = row.locator('button[title="Lihat Profil"]');
    await viewButton.click();
  }

  await clickLihatProfilByIC(page, data.ic);

  await page.getByRole('button', { name: 'Bantuan', exact: true }).click();

  await page.waitForTimeout(5000);

  // Locator
  const lulusBadge = (page: Page) => page.getByText("Lulus", { exact: true });

  // Function
  async function assertStatusLulus(page: Page) {
    await expect(lulusBadge(page).first()).toBeVisible();
  }

  await assertStatusLulus(page);

  console.log('No Pengenalan - ' + data.ic);
  console.log('Nama - ' + data.name);

});