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
  await page.getByLabel('Kariah', { exact: true }).getByText('MASJID AHMADI RANTAU PANJANG').click();
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

  await selectFromDropdownByLabel(page, 'Aid', 'BANTUAN KEPERLUAN HIDUP (FAKIR)');
  await selectFromDropdownByLabel(page, 'Aid Product', 'KATEGORI MAKAN/MINUM (FAKIR)');
  await selectFromDropdownByLabel(page, 'Product Package', 'KEPERLUAN MAKAN/MINUM (FAKIR)');

  await page.getByText('KEPERLUAN MAKAN/MINUM (FAKIR)').nth(2).click();

  await page.locator('label').filter({ hasText: 'Cash Counter/Lapangan' }).click();
  await page.getByRole('textbox', { name: 'Penyataan Masalah*' }).click();
  await page.getByRole('textbox', { name: 'Penyataan Masalah*' }).fill('Masalah');
  await page.getByRole('button', { name: 'Edit' }).click();

  await page.getByRole('spinbutton', { name: 'Kadar Bantuan (RM)*' }).click();
  await page.getByRole('spinbutton', { name: 'Kadar Bantuan (RM)*' }).fill('20');

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

  await selectFromDropdownByLabel(page, 'Nama Pegawai', 'SUZIELA BINTI AZIZ');

  await page.getByRole('button', { name: 'Hantar Permohonan' }).click();

  await logout(page);

  //});

  // ------------------------------------------------
  //        EKP 2
  // ------------------------------------------------

  async function clickPaymentsButtonForRow(page: Page, rowNumber: number) {
    const row = page.locator('tbody tr').filter({
      has: page.locator('td:first-child', { hasText: new RegExp(`^${rowNumber}$`) })
    });

    const paymentsButton = row.locator('button').filter({
      has: page.locator('.i-material-symbols\\:payments-outline-rounded')
    });

    await paymentsButton.click();
  }

  async function selectFromDropdownByIndex(page: Page, index: number, optionText: string) {
    const field = page.locator('.formkit-outer[data-type="selectSearch"]').nth(index);
    await field.locator('.select-trigger').click();

    const listbox = page.getByRole('listbox').filter({ visible: true }).first();
    await listbox.waitFor({ state: 'visible', timeout: 5000 });

    const option = listbox.getByRole('option', { name: optionText, exact: true });
    await option.click();
    await page.waitForTimeout(500);
  }

  async function checkRowByICNumber(page: Page, icNumber: string) {
    const row = page.locator('tbody tr').filter({
      has: page.locator('td', { hasText: new RegExp(`^${icNumber}$`) })
    });

    const checkbox = row.locator('input[type="checkbox"]');
    await checkbox.check();
  }

  await page.getByRole('textbox', { name: 'ID Pengguna' }).click();

  await page.getByRole('textbox', { name: 'ID Pengguna' }).fill('suziela');

  await page.getByRole('textbox', { name: 'ID Pengguna' }).press('Tab');

  await page.getByRole('textbox', { name: 'Kata Laluan*' }).fill('Password123@');

  await page.getByRole('button', { name: 'Log Masuk', exact: true }).click();

  await page.waitForTimeout(3000);

  await page.locator('a').filter({ hasText: 'Kelulusan' }).click();

  await page.waitForTimeout(3000);

  await page.getByRole('cell', { name: data.ic }).click();

  await page.waitForTimeout(5000);

  await page.getByRole('button', { name: 'Bantuan', exact: true }).click();

  await page.waitForTimeout(5000);

  await page.getByRole('button', { name: 'Lihat / Tindakan' }).click();

  await page.waitForTimeout(5000);

  await selectFromDropdownByLabel(page, 'Status Kelulusan', 'Lulus');

  await page.getByRole('textbox', { name: 'Catatan*' }).click();

  await page.getByRole('textbox', { name: 'Catatan*' }).fill('catatan');

  await page.getByRole('button', { name: 'Simpan' }).click();

  await page.waitForTimeout(5000);

  await selectFromDropdown(page, 'keputusan', 'Lulus');

  await page.getByRole('textbox', { name: 'Masukkan catatan kelulusan...' }).click();

  await page.getByRole('textbox', { name: 'Masukkan catatan kelulusan...' }).fill('lulus');

  await page.getByRole('button', { name: 'Hantar' }).click();

  await page.waitForTimeout(1000);

  await page.getByRole('button', { name: 'Ya, Hantar' }).click();

  await page.waitForTimeout(1000);

  await page.getByRole('button', { name: 'OK' }).click();

  await page.waitForTimeout(1000);

  await page.getByRole('button', { name: 'Ya, Teruskan' }).click();

  await page.goto('https://stg.nas-internal.com/pengurusan-tunai/pengeluaran-tunai');

  await clickPaymentsButtonForRow(page, 3); // only row 3 has the payments icon

  await page.waitForTimeout(5000);

  await selectFromDropdownByIndex(page, 0, 'Kaunter Express');

  await page.waitForTimeout(1000);

  async function searchTable(page: Page, searchText: string) {
    const searchInput = page.getByPlaceholder('Cari...');
    await searchInput.click();
    await searchInput.fill(searchText);
  }

  await searchTable(page, data.ic);

  await checkRowByICNumber(page, data.ic);

  await page.getByRole('button', { name: 'Sahkan & Serah Tunai' }).click();

  await page.waitForTimeout(1000);

  await page.getByRole('button', { name: 'Ya, Sahkan & Serah' }).click();

  await page.waitForTimeout(3000);

  await page.locator('input[type="radio"][value="tandatangan"]').click();

  await page.waitForTimeout(1000);

  async function fakeSignature(page: Page) {
    const canvas = page.locator('canvas.signature-canvas');
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

      // Fire pointer events so any Vue/JS listener updates its internal "isEmpty" state
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
  console.log('Placeholder still visible:', await page.locator('.signature-placeholder').isVisible());

  await page.getByRole('button', { name: 'Sahkan Penerimaan' }).click();

  await page.waitForTimeout(1000);

  await page.getByRole('button', { name: 'Ya, Sahkan' }).click();

  await page.waitForTimeout(1000);

  await page.getByRole('heading', { name: 'Slip Penerimaan Tunai', exact: true }).click();

  await page.waitForTimeout(1000);

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

  const fileInput4 = page.getByRole('main').locator('input[type="file"]');
  await fileInput4.setInputFiles(filePath);
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
  await page.waitForTimeout(1000);

  await page.getByRole('button', { name: 'OK' }).click();
  await page.waitForTimeout(1000);

  await logout(page);

  // ------------------------------------------------
  //        KOAD KLANG
  // ------------------------------------------------

  await page.getByRole('textbox', { name: 'ID Pengguna' }).click();
  await page.getByRole('textbox', { name: 'ID Pengguna' }).fill('ZAKATSELhairol.azmi');
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).click();
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).fill('Password123@');
  await page.getByRole('button', { name: 'Log Masuk', exact: true }).click();
  await page.waitForTimeout(3000);

  await page.locator('a').filter({ hasText: 'Kelulusan' }).click();
  await page.waitForTimeout(3000);

  await page.getByRole('cell', { name: data.ic }).click();
  await page.waitForTimeout(3000);

  await selectFromDropdown(page, 'keputusan', 'Lulus');

  await page.getByRole('textbox', { name: 'Masukkan catatan kelulusan...' }).click();
  await page.getByRole('textbox', { name: 'Masukkan catatan kelulusan...' }).fill('lulus');

  await page.getByRole('button', { name: 'Hantar' }).click();
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: 'Ya, Hantar' }).click();
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: 'OK' }).click();

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