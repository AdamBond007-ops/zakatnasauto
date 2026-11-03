import { test, expect, Page } from '@playwright/test';

async function selectValidAsnafWithCheck1(page: Page) {
    let selectedValid = false;
    let attempts = 0;
    const maxAttempts = 15;

    // 1. Open "Pilih Asnaf" modal outside the loop
    await page.getByRole('button', { name: 'Pilih Asnaf' }).click();
    await page.waitForTimeout(6000);

    // 2. Filter by PETALING
    await page.locator('span').filter({ hasText: /^Sila Pilih$/ }).click();
    await page.locator('span').filter({ hasText: 'PETALING' }).first().click();
    await page.getByText('Pilih satu atau lebih (kosong').click();
    await page.getByRole('textbox', { name: 'Pilih satu atau lebih (kosong' }).fill('ria');
    await page.getByRole('listbox').getByText('MASJID RIADHUS SOLIHIN, TAMAN').click();
    await page.getByRole('button', { name: 'Cari' }).click();
    await page.waitForTimeout(6000);

    while (!selectedValid && attempts < maxAttempts) {
        attempts++;

        const modal = page.locator('.swal2-popup, .modal, .modal-content, [role="dialog"]').last();
        const availableCheckbox = modal.locator('td:last-child input[type="checkbox"]:not(:checked):not(:disabled)').first();
        
        if (await availableCheckbox.count() === 0) {
            const nextModalPage = page.locator('button:nth-child(6)'); 
            if (await nextModalPage.isVisible()) {
                await nextModalPage.click();
                await page.waitForTimeout(6000);
                continue;
            } else {
                throw new Error('No available active checkboxes found!');
            }
        }

        // Check the box and immediately break/exit since we don't need to read jumlah anymore
        await availableCheckbox.check();
        await page.waitForTimeout(6000);

        const pilihModalButton = modal.getByRole('button', { name: 'Pilih', exact: true });
        if (await pilihModalButton.isVisible()) {
            await pilihModalButton.click();
        } else {
            await page.getByRole('button', { name: 'Pilih', exact: true }).last().click();
        }
        
        await page.waitForTimeout(6000);
        selectedValid = true;
        break;
    }
}

test('test', async ({ page }) => {
  await page.goto('https://stg.nas-internal.com/login');
  await page.getByRole('textbox', { name: 'ID Pengguna' }).click();
  await page.getByRole('textbox', { name: 'ID Pengguna' }).fill('syafiq.a');
  await page.getByRole('textbox', { name: 'ID Pengguna' }).press('Tab');
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).fill('Password123@');
  await page.getByRole('button', { name: 'Log Masuk', exact: true }).click();
  await page.getByRole('button', { name: 'Tukar Peranan' }).click();
  await page.getByRole('menuitem', { name: 'PT_BTN' }).click();
  await page.getByRole('button', { name: 'Bantuan Utama' }).click();
  await page.locator('a').filter({ hasText: 'Cipta Bantuan Raya' }).click();
  await page.locator('.iconify.i-heroicons\\:chevron-down').first().click();
  await page.locator('span').filter({ hasText: 'BANTUAN RAMADHAN & HARI RAYA' }).first().click();
  await page.getByRole('button', { name: 'Simpan' }).click();
  //i. Mesej ralat dipaparkan (validasi/kebenaran/status).

  await page.locator('div').filter({ hasText: /^Sila Pilih$/ }).click();
  await page.locator('span').filter({ hasText: 'RAMADHAN & HARI RAYA (FAKIR)' }).nth(1).click();
  await page.waitForTimeout(6000);
  await page.getByRole('checkbox', { name: 'PEMBAYARAN TERUS (FAKIR)- TT' }).check();
  await page.getByRole('button', { name: 'Pilih Asnaf' }).click();
  await page.locator('.iconify.i-ic\\:round-close').click();
  await page.getByText('Simpan Hantar Lengkapkan').click();
  //ralat

  await selectValidAsnafWithCheck1(page);

  await page.getByRole('button', { name: 'Pilih Asnaf' }).click();
  await page.locator('.formkit-outer.formkit-outer-global.\\[\\&_\\.formkit-label\\]\\:font-semibold > .formkit-wrapper > .formkit-inner > .formkit-select-search > .select-trigger > .iconify').click();
  await page.locator('span').filter({ hasText: 'PETALING' }).first().click();
  await page.getByRole('button', { name: 'Cari' }).click();
  await page.getByRole('button', { name: 'Tutup' }).click();
    //pilih asnaf dua kali

    //hantar utk semakan oleh eksekutif jabatan
    await page.locator('.px-2 > .rounded').first().check();
    await page.getByRole('button', { name: 'Hantar' }).click();
    await page.getByRole('button', { name: 'Ya, Hantar' }).click();
    await page.waitForTimeout(6000);

//satu lagi data utk test tidak lulus ketua jabatan

await page.locator('a').filter({ hasText: 'Cipta Bantuan Raya' }).click();
await page.locator('.iconify.i-heroicons\\:chevron-down').first().click();
await page.locator('span').filter({ hasText: 'BANTUAN RAMADHAN & HARI RAYA' }).first().click();
await page.locator('div:nth-child(4) > .formkit-wrapper > .formkit-inner > .formkit-select-search > .select-trigger > .iconify').click();
await page.getByLabel('Aid Product', { exact: true }).getByText('RAMADHAN & HARI RAYA (FAKIR)').click();
await page.getByRole('checkbox', { name: 'PEMBAYARAN TERUS (FAKIR)- TT' }).check();
await page.waitForTimeout(5000);
await selectValidAsnafWithCheck1(page);
await page.waitForTimeout(5000);
  await page.getByRole('cell').first().click();
  await page.getByRole('button', { name: 'Hantar' }).click();
  await page.getByRole('button', { name: 'Ya, Hantar' }).click();
  await page.waitForTimeout(5000);
  await page.getByRole('button', { name: 'Log Keluar' }).click();


  //Eksek tak luluskan
 
  await page.getByRole('textbox', { name: 'ID Pengguna' }).click();
  await page.getByRole('textbox', { name: 'ID Pengguna' }).fill('amanina.ar');
  await page.getByRole('textbox', { name: 'ID Pengguna' }).press('Tab');
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).fill('Password123@');
  await page.getByRole('button', { name: 'Log Masuk', exact: true }).click();
  await page.getByRole('button', { name: 'Bantuan Utama' }).click();
  await page.locator('a').filter({ hasText: 'Senarai Bantuan Utama' }).click();
  await page.locator('th:nth-child(7) > div > .flex > .inline-flex > .iconify').click();
  const actionButton = page.getByRole('row').nth(1).locator('td').last().getByRole('button');
    await actionButton.hover();
    await actionButton.click();
  await page.getByLabel('Status Semakan*').selectOption('PINDAAN_EOAD');
  await page.getByRole('textbox', { name: 'Catatan*' }).click();
  await page.getByRole('textbox', { name: 'Catatan*' }).fill('tidak sokong test');
  await page.getByRole('textbox', { name: 'Wajib diisi jika tidak' }).click();
  await page.getByRole('textbox', { name: 'Wajib diisi jika tidak' }).fill('tidak sokong');
  await page.getByRole('button', { name: 'Hantar' }).click();
  await page.getByRole('button', { name: 'Ya, Hantar' }).click();
  await page.waitForTimeout(5000);
  await page.locator('th:nth-child(7) > div > .flex > .inline-flex > .iconify').click();
  await page.locator('.inline-flex.items-center.justify-center.w-8').first().click();
  await page.locator('.px-2 > .rounded').first().check();
  await page.getByRole('combobox').selectOption('SOKONG');
  await page.getByRole('button', { name: 'Sahkan (1 dipilih)' }).click();
  await page.getByRole('button', { name: 'Ya, Sahkan' }).click();
  await page.getByRole('textbox', { name: 'Catatan*' }).click();
  await page.getByRole('textbox', { name: 'Catatan*' }).fill('catatan');
  await page.getByRole('button', { name: 'Hantar' }).click();
  await page.getByRole('button', { name: 'Ya, Hantar' }).click();
  await page.waitForTimeout(5000);
  await page.getByRole('button', { name: 'Log Keluar' }).click();

    //Ketua jabatan tak luluskan
    await page.getByRole('textbox', { name: 'ID Pengguna' }).click();
    await page.getByRole('textbox', { name: 'ID Pengguna' }).fill('rizal79');
    await page.getByRole('textbox', { name: 'ID Pengguna' }).press('Tab');
    await page.getByRole('textbox', { name: 'Kata Laluan*' }).fill('Password123@');
    await page.getByRole('button', { name: 'Log Masuk', exact: true }).click();
    await page.getByRole('button', { name: 'Bantuan Utama' }).click();
    await page.locator('a').filter({ hasText: 'Senarai Bantuan Utama' }).click();
    const actionButton1 = page.getByRole('row').nth(1).locator('td').last().getByRole('button');
    await actionButton1.hover();
    await actionButton1.click();
    await page.waitForTimeout(10000);
    await page.getByRole('combobox').selectOption('PINDAAN_PELULUS');
    await page.getByRole('textbox', { name: 'Masukkan catatan...' }).click();
    await page.getByRole('textbox', { name: 'Masukkan catatan...' }).fill('tidak lulus');
    await page.getByRole('button', { name: 'Hantar' }).click();
    await page.getByRole('button', { name: 'Ya, Hantar' }).click();
    await page.waitForTimeout(5000);
  await page.getByRole('button', { name: 'Log Keluar' }).click();   

  
  //check notification pt btn
  await page.getByRole('textbox', { name: 'ID Pengguna' }).click();
  await page.getByRole('textbox', { name: 'ID Pengguna' }).fill('syafiq.a');
  await page.getByRole('textbox', { name: 'ID Pengguna' }).press('Tab');
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).fill('Password123@');
  await page.getByRole('button', { name: 'Log Masuk', exact: true }).click();
  await page.getByRole('button', { name: 'Tukar Peranan' }).click();
  await page.getByRole('menuitem', { name: 'PT_BTN' }).click();
  await page.getByRole('button', { name: 'Notifikasi' }).click();
  await page.getByRole('menuitem', { name: 'Lihat semua notifikasi' }).click();
});