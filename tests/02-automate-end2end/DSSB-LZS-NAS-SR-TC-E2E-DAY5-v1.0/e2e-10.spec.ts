import { test, expect, type Page } from '@playwright/test';

async function clickKewangan(page: Page) {
  await page.locator('button[role="menuitem"]', { hasText: 'KEWANGAN' }).click();
}

// clickRekodPenerimaan.js
async function clickRekodPenerimaan(page: Page, penerimaName: string) {
  const row = page.locator('tr', { hasText: penerimaName });
  await row.getByRole('button').click();
}

// fillCatatan.js
async function fillCatatan(page: Page, catatan: string) {
  await page.locator('textarea.rekod-catatan-input').fill(catatan);
}

// fillJumlahTunaiDiterima.js
async function fillJumlahTunaiDiterima(page: Page) {
  // 1. Read the displayed "Jumlah yang Dimohon" amount
  const dimohonText = await page
    .locator('[aria-labelledby="rekod-jumlah-dimohon-label"]')
    .innerText(); // " RM 11.00"

  // 2. Extract the numeric part (e.g. "11.00")
  const amount = dimohonText.replace(/[^\d.]/g, '').trim(); // "11.00"

  // 3. Fill the editable "Jumlah Tunai Diterima" input
  await page.locator('#rekod-jumlah-tunai-diterima').fill(amount);

  return amount;
}

// clickHantar.js
async function clickHantar(page: Page) {
  await page.getByRole('dialog').getByRole('button', { name: /Hantar/ }).click();
}

module.exports = { clickHantar };

module.exports = { fillJumlahTunaiDiterima };

module.exports = { fillCatatan };

module.exports = { clickRekodPenerimaan };

test('test', async ({ page }) => {
  await page.goto('https://stg.nas-internal.com/login');
  
//------------------
// KC Login
//------------------

  await page.getByRole('textbox', { name: 'ID Pengguna' }).click();
  await page.getByRole('textbox', { name: 'ID Pengguna' }).click();
  await page.getByRole('textbox', { name: 'ID Pengguna' }).fill('helmi');
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).click();
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).fill('Password123@');
  await page.getByRole('button', { name: 'Log Masuk', exact: true }).click();
  await page.getByRole('button', { name: 'Rekupmen Tunai' }).click();
  await page.locator('a').filter({ hasText: 'Senarai Permohonan Rekupmen' }).click();
  await page.getByRole('button', { name: 'Mohon Rekupmen' }).click();
  await page.getByRole('textbox', { name: 'Catatan*' }).click();
  await page.getByRole('textbox', { name: 'Catatan*' }).fill('catatan');
  await page.getByRole('button', { name: 'Hantar' }).click();
  await page.getByRole('button', { name: 'Ya, Hantar' }).click();
  await page.waitForTimeout(3000);
  await page.getByRole('button', { name: 'Log Keluar' }).click();

//------------------
// Kewangan Login
//------------------
  
  await page.getByRole('textbox', { name: 'ID Pengguna' }).click();
  await page.getByRole('textbox', { name: 'ID Pengguna' }).fill('zakatselm.nazri');
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).click();
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).fill('Password123@');
  await page.getByRole('button', { name: 'Log Masuk', exact: true }).click();
  await page.getByRole('button', { name: 'Tukar Peranan' }).click();
  await clickKewangan(page);
  await page.waitForTimeout(3000);
  await page.getByRole('button', { name: 'Rekupmen Tunai' }).click();
  await page.locator('a').filter({ hasText: 'Semakan Kelulusan Rekupmen' }).click();
  await page.locator('th:nth-child(5) > .flex.min-w-0.items-center.gap-2.text-left.justify-between > .flex > .inline-flex > .iconify').click();
  await page.getByRole('button', { description: 'Semakan & Kelulusan', exact: true }).click();
  await page.getByRole('button', { name: 'Tukar Peranan' }).click();
  await page.getByRole('button', { name: 'Tukar Peranan' }).click();
  await page.getByText('Sila Pilih').nth(1).click();
  await page.locator('span').filter({ hasText: 'Lulus' }).nth(2).click();
  await page.getByText('Sila Pilih').nth(1).click();
  await page.getByLabel('Options').getByText('MOHAMAD NAFI BIN JEMARON').click();
  await page.locator('#semakanKelulusanTindakan').getByText('Sila Pilih', { exact: true }).click();
  await page.locator('span').filter({ hasText: 'MAYBANK MALAYSIA BERHAD,' }).first().click();
  await page.getByRole('textbox', { name: 'Masukkan catatan (wajib diisi)' }).click();
  await page.getByRole('textbox', { name: 'Masukkan catatan (wajib diisi)' }).fill('cattaa');
  await page.getByRole('button', { name: 'Hantar' }).click();
  await page.getByRole('button', { name: 'Ya, Luluskan' }).click();
  await page.getByRole('button', { name: 'OK' }).click();
  await page.waitForTimeout(3000);
  await page.getByRole('button', { name: 'Log Keluar' }).click();

//------------------
// PKP Login
//------------------

  await page.getByRole('textbox', { name: 'ID Pengguna' }).click();
  await page.getByRole('textbox', { name: 'ID Pengguna' }).fill('mazlinda.eedayu');
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).click();
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).fill('Password123@');
  await page.getByRole('button', { name: 'Log Masuk', exact: true }).click();
  await page.getByRole('button', { name: 'Rekupmen Tunai' }).click();
  await page.locator('a').filter({ hasText: 'Senarai Penerimaan Tunai' }).click();
  await clickRekodPenerimaan(page, 'AMIL PUCHONG');
  const amount = await fillJumlahTunaiDiterima(page);
  console.log('Filled:', amount); 
  await fillCatatan(page, 'Bayaran tunai diterima pada 12/11/2026');
  await clickHantar(page);
});