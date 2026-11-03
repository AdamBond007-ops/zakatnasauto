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

    // The panel is portaled to <body> with role="listbox" and aria-label matching the field label
    const listbox = page.getByRole('listbox').filter({ visible: true }).first();
    await listbox.waitFor({ state: 'visible', timeout: 5000 });
    await page.waitForTimeout(2000);

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

const data = {
    name: `MAZ`, // change accordingly
    ic: '691116032927', //change accordingly
    email: `maz.${firstName.toLowerCase()}${faker.number.int({ min: 100, max: 999 })}@gmail.com`,
    phone: '0120101001',
    address: 'F-3-4',
};

test('TC Kemaskini AR + JPOAD + JPSK', async ({ page }) => {
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
    await page.waitForTimeout(5000);
  
    async function clickLihatProfilByIC(page: Page, icNumber: string) {
      const row = page.locator('tbody tr').filter({
        has: page.locator('span.font-medium', { hasText: new RegExp(`^${icNumber}$`) })
      });
  
      const viewButton = row.locator('button[title="Lihat Profil"]');
      await viewButton.click();
    }
  
    await clickLihatProfilByIC(page, data.ic);
    await page.waitForTimeout(5000);
  
    await page.getByRole('button', { name: 'Kemaskini', exact: true }).click();
    await page.waitForTimeout(1000);
  
    await page.getByRole('button', { name: 'Ya, Kemaskini', exact: true }).click();
    await page.waitForTimeout(3000);
  
    // ------------------------------------------------
    //        MAKLUMAT PERIBADI
    // ------------------------------------------------
  
    await page.getByRole('button', { name: 'Maklumat Pemohon' }).click();
    await page.waitForTimeout(3000);
  
    await selectRadioByValue(page, 'adakah_muallaf', 'Y');
  
    await page.getByRole('textbox', { name: 'Tarikh Masuk Islam* Update' }).fill('2026-08-04');
  
    const filePath = getFirstUploadFile();
    const fileInput1 = page.locator('input[type="file"]').nth(3);
    await fileInput1.setInputFiles(filePath);
    await page.waitForTimeout(1000);
  
    await page.getByRole('button', { name: 'Seterusnya' }).click();
    await page.waitForTimeout(3000);
  
    await page.getByRole('button', { name: 'Bantuan', exact: true }).click();
    await page.waitForTimeout(3000);
  
    // ------------------------------------------------
    //        BANTUAN
    // ------------------------------------------------
  
    await page.getByRole('button', { name: 'Mohon Bantuan Baru' }).click();
    await page.waitForTimeout(5000);
  
    await selectFromDropdownByLabel(page, 'Aid', 'BANTUAN KEPERLUAN HIDUP (MUALLAF)');
    await selectFromDropdownByLabel(page, 'Aid Product', 'KATEGORI MAKAN/MINUM (MUALLAF)');
    await selectFromDropdownByLabel(page, 'Product Package', 'KATEGORI MAKAN/MINUM (MUALLAF)');
  
    await page.getByText('KATEGORI MAKAN/MINUM (MUALLAF)').nth(4).click();
  
    await page.getByRole('textbox', { name: 'Penyataan Masalah*' }).click();
    await page.getByRole('textbox', { name: 'Penyataan Masalah*' }).fill('Masalah');
    await page.getByRole('button', { name: 'Edit' }).click();
  
    await page.getByRole('spinbutton', { name: 'Kadar Bantuan (RM)*' }).click();
    await page.getByRole('spinbutton', { name: 'Kadar Bantuan (RM)*' }).fill('20');
  
    await selectFromDropdownByLabel(page, 'Kategori Penerima', 'Asnaf');
    await selectFromDropdownByLabel(page, 'Kaedah Pembayaran', 'EFT');
  
    const modal = page.locator('.modal.modal-top');
    await modal.waitFor({ state: 'visible' });
  
    // Scope Simpan to *inside* the modal specifically
    await modal.getByRole('button', { name: 'Simpan', exact: true }).click();
  
    const filePath2 = getFirstUploadFile();
    await uploadFileForLabeledRow(page, 'Pengesahan Pendapatan', filePath2);
    await page.waitForTimeout(5000);
  
    await page.getByRole('button', { name: 'Simpan' }).click();
    await page.getByRole('button', { name: 'Ya, Simpan' }).click();
    await page.getByRole('button', { name: 'OK' }).click();
    await page.waitForTimeout(5000);
  
    await page.getByRole('button', { name: 'Mohon Bantuan Baru' }).click();
    await page.waitForTimeout(5000);
  
    await selectFromDropdownByLabel(page, 'Aid', '(HQ) SUMBANGAN PENDIDIKAN OKU (MUALLAF)');
    await selectFromDropdownByLabel(page, 'Aid Product', '(HQ) SUMBANGAN PENDIDIKAN OKU');
    await selectFromDropdownByLabel(page, 'Product Package', '(GL ONE-OFF) (HQ) YURAN PENDAFTARAN');
  
    await page.getByText('(GL ONE-OFF) (HQ) YURAN PENDAFTARAN').nth(2).click();
  
    await page.getByRole('textbox', { name: 'Penyataan Masalah*' }).click();
    await page.getByRole('textbox', { name: 'Penyataan Masalah*' }).fill('Masalah');
    await page.getByRole('button', { name: 'Edit' }).click();
  
    await page.getByRole('spinbutton', { name: 'Kadar Bantuan (RM)*' }).click();
    await page.getByRole('spinbutton', { name: 'Kadar Bantuan (RM)*' }).fill('20');
  
    await selectFromDropdownByLabel(page, 'Kategori Penerima', 'Asnaf');
    await selectFromDropdownByLabel(page, 'Kaedah Pembayaran', 'EFT');
  
    // Scope Simpan to *inside* the modal specifically
    await modal.getByRole('button', { name: 'Simpan', exact: true }).click();
  
    const filePath3 = getFirstUploadFile();
    await uploadFileForLabeledRow(page, 'Dokumen Sokongan Kesihatan', filePath3);
    await page.waitForTimeout(5000);
  
    await page.getByRole('button', { name: 'Simpan' }).click();
    await page.getByRole('button', { name: 'Ya, Simpan' }).click();
    await page.getByRole('button', { name: 'OK' }).click();
    await page.waitForTimeout(5000);
  
    await page.getByRole('button', { name: 'Togol senarai bahagian belum' }).click();
    await page.getByRole('button', { name: 'Pergi ke Pengesahan Akhir — 1' }).click();
  
    await selectCheckboxByValue(page, 'pdpa_consent', 'true');
  
    await page.getByRole('button', { name: 'Pergi ke Aduan — 1 medan' }).click();
  
    await page.getByText('Kuning : Terputus bekalan').click();
  
    await page.locator('label').filter({ hasText: 'Pendapatan tidak mencukupi' }).click();
  
    await page.waitForTimeout(1000);
  
    await page.getByRole('textbox', { name: 'Pernyataan Masalah*' }).click();
    await page.getByRole('textbox', { name: 'Pernyataan Masalah*' }).fill('MASALAH');
  
    await page.getByRole('button', { name: 'Seterusnya' }).click();
    await page.waitForTimeout(5000);
  
    await page.getByRole('button', { name: 'Pengesahan' }).click();
    await page.getByRole('button', { name: 'Hantar Permohonan' }).click();
    await page.getByRole('button', { name: 'Ya, Hantar' }).click();
    await page.getByRole('button', { name: 'OK' }).click();
    await page.waitForTimeout(5000);
  
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
  
    // 1. Check status for (HQ) SUMBANGAN PENDIDIKAN OKU
    await assertRowStatus(page, '(HQ) SUMBANGAN PENDIDIKAN OKU', 'Perlu Diproses oleh Jabatan/Divisyen lain');
  
    // 2. Click Lihat / Kemaskini for the other two rows
    await clickLihatKemaskini(page, 'KATEGORI MAKAN/MINUM (MUALLAF)');
    await page.waitForTimeout(3000);
  
    await selectFromDropdownByLabel(page, 'Status Siasatan', 'Sokong');
    await page.getByRole('textbox', { name: 'Catatan*' }).click();
    await page.getByRole('textbox', { name: 'Catatan*' }).fill('sada');
    await page.getByRole('button', { name: 'Simpan' }).click();
    await page.waitForTimeout(3000);
  
    await clickLihatKemaskini(page, '(HQ) SAGUHATI GALAKAN SAUDARA BARU (MUALLAF)');
    await page.waitForTimeout(3000);
  
    await selectFromDropdownByLabel(page, 'Status Siasatan', 'Sokong');
    await page.getByRole('textbox', { name: 'Catatan*' }).click();
    await page.getByRole('textbox', { name: 'Catatan*' }).fill('sada');
    await page.getByRole('button', { name: 'Simpan' }).click();
    await page.waitForTimeout(3000);
  
    await selectFromDropdownByLabel(page, 'Kaedah Siasatan', 'Semak Dokumen Sahaja');
  
    await page.getByRole('textbox', { name: 'Laporan Siasatan*' }).click();
    await page.getByRole('textbox', { name: 'Laporan Siasatan*' }).fill('Laporan');
  
    await page.getByRole('button', { name: 'Togol senarai bahagian belum' }).click();
    await page.getByRole('button', { name: 'Pergi ke Pengesahan Akhir — 1' }).click();
  
    await selectCheckboxByValue(page, 'pdpa_consent', 'true');
  
    await selectFromDropdownByLabel(page, 'Sokongan', 'Sokong');
  
    await page.getByRole('textbox', { name: 'Catatan*' }).click();
    await page.getByRole('textbox', { name: 'Catatan*' }).fill('dasdasd');
  
    await page.getByRole('button', { name: 'Hantar' }).click();
    await page.waitForTimeout(1000);
    await page.getByRole('button', { name: 'Ya, Hantar' }).click();
    await page.waitForTimeout(2000);
    await page.getByRole('button', { name: 'OK' }).click();
    await page.waitForTimeout(3000);
  
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
  
    await page.getByRole('button', { name: 'Bantuan', exact: true }).click();
    await page.waitForTimeout(3000);
  
    async function clickLihatTindakan(page: Page, docName: string) {
      const row = getRowByDocName(page, docName);
      await row.locator('button[title="Lihat / Tindakan"]').click();
    }
  
    // 2. Click Lihat / Tindakan for the two rows
    await clickLihatTindakan(page, '(HQ) SAGUHATI GALAKAN SAUDARA BARU (MUALLAF)');
    await page.waitForTimeout(5000);
  
    await selectFromDropdownByLabel(page, 'Status Kelulusan', 'Lulus');
    await page.getByRole('textbox', { name: 'Catatan*' }).click();
    await page.getByRole('textbox', { name: 'Catatan*' }).fill('sada');
    await page.getByRole('button', { name: 'Simpan' }).click();
    await page.waitForTimeout(3000);
  
    await clickLihatTindakan(page, 'KATEGORI MAKAN/MINUM (MUALLAF)');
    await page.waitForTimeout(5000);
  
    await selectFromDropdownByLabel(page, 'Status Kelulusan', 'Lulus');
    await page.getByRole('textbox', { name: 'Catatan*' }).click();
    await page.getByRole('textbox', { name: 'Catatan*' }).fill('sada');
    await page.getByRole('button', { name: 'Simpan' }).click();
    await page.waitForTimeout(7000);
  
    await selectFromDropdown(page, 'keputusan', 'Lulus');
  
    await page.getByRole('textbox', { name: 'Masukkan catatan kelulusan...' }).click();
    await page.getByRole('textbox', { name: 'Masukkan catatan kelulusan...' }).fill('lulus');
  
    await page.getByRole('button', { name: 'Hantar' }).click();
    await page.waitForTimeout(1000);
    await page.getByRole('button', { name: 'Ya, Hantar' }).click();
    await page.waitForTimeout(2000);
    await page.getByRole('button', { name: 'OK' }).click();
  
    await logout(page);
  
    // ------------------------------------------------
    //        EJPSK
    // ------------------------------------------------
  
    await page.getByRole('textbox', { name: 'ID Pengguna' }).click();
    await page.getByRole('textbox', { name: 'ID Pengguna' }).fill('zulfadlil');
    await page.getByRole('textbox', { name: 'Kata Laluan*' }).click();
    await page.getByRole('textbox', { name: 'Kata Laluan*' }).fill('Password123@');
    await page.getByRole('button', { name: 'Log Masuk', exact: true }).click();
    await page.waitForTimeout(3000);
  
    await page.locator('a').filter({ hasText: 'Tugasan' }).click();
    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'Siasatan' }).click();
    await page.waitForTimeout(3000);
  
    await page.getByRole('searchbox', { name: 'Cari...' }).click();
    await page.getByRole('searchbox', { name: 'Cari...' }).fill(data.ic);
    await page.getByRole('button', { name: `Kemaskini ${data.name} (${data.ic})` }).click();
    await page.waitForTimeout(5000);
  
    //await clickLihatKemaskini
    await page.getByRole('button', { name: 'Lihat / Kemaskini' }).click();
    await page.waitForTimeout(3000);
  
    await selectFromDropdownByLabel(page, 'Status Siasatan', 'Sokong');
    await page.getByRole('textbox', { name: 'Catatan*' }).click();
    await page.getByRole('textbox', { name: 'Catatan*' }).fill('sada');
    await page.getByRole('button', { name: 'Simpan' }).click();
    await page.waitForTimeout(3000);
  
    await selectFromDropdownByLabel(page, 'Kaedah Siasatan', 'Semak Dokumen Sahaja');
  
    await page.getByRole('textbox', { name: 'Laporan Siasatan*' }).click();
    await page.getByRole('textbox', { name: 'Laporan Siasatan*' }).fill('Laporan');
  
    await page.getByRole('button', { name: 'Hantar' }).click();
    await page.waitForTimeout(1000);
    await page.getByRole('button', { name: 'Ya, Sahkan' }).click();
    await page.waitForTimeout(2000);
    await page.getByRole('button', { name: 'OK' }).click();
    await page.waitForTimeout(3000);
  
    await logout(page);
  
    // ------------------------------------------------
    //        KJPSK
    // ------------------------------------------------
  
    await page.getByRole('textbox', { name: 'ID Pengguna' }).click();
    await page.getByRole('textbox', { name: 'ID Pengguna' }).fill('amir.akhbar');
    await page.getByRole('textbox', { name: 'Kata Laluan*' }).click();
    await page.getByRole('textbox', { name: 'Kata Laluan*' }).fill('Password123@');
    await page.getByRole('button', { name: 'Log Masuk', exact: true }).click();
    await page.waitForTimeout(3000);
  
    await page.locator('a').filter({ hasText: 'Tugasan' }).click();
    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'Kelulusan' }).filter({ hasNotText: 'Pembatalan' }).click();
    await page.waitForTimeout(3000);
  
    await page.getByRole('searchbox', { name: 'Cari...' }).click();
    await page.getByRole('searchbox', { name: 'Cari...' }).fill(data.ic);
    await page.getByRole('button', { name: `Kemaskini ${data.name} (${data.ic})` }).click();
    await page.waitForTimeout(5000);
  
    await clickLihatTindakan(page, '(HQ) SUMBANGAN PENDIDIKAN OKU');
    await page.waitForTimeout(7000);
  
    await selectFromDropdownByLabel(page, 'Status Kelulusan', 'Lulus');
  
    await page.getByRole('textbox', { name: 'Catatan*' }).click();
    await page.getByRole('textbox', { name: 'Catatan*' }).fill('dasdasd');
  
    await page.getByRole('button', { name: 'Simpan' }).click();
    await page.waitForTimeout(3000);
  
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
  
  });

