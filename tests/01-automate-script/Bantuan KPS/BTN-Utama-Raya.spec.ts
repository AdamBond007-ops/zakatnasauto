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
    await page.waitForTimeout(10000);

    while (!selectedValid && attempts < maxAttempts) {
        attempts++;
    
        const modal = page.locator('.swal2-popup, .modal, .modal-content, [role="dialog"]').last();
        
        // Search across all rows instead of locking onto the first row only
        const availableCheckboxes = modal.locator('table tbody tr td input[type="checkbox"]:not(:checked):not(:disabled)');
        const count = await availableCheckboxes.count();
        console.log(`Attempt ${attempts}: Found ${count} available checkboxes.`);
    
        if (count === 0) {
            const nextModalPage = modal.locator('button:has-text(">"), a:has-text(">"), button:has-text("Next"), .pagination .next, [aria-label="Next"], button:nth-child(6)').last();
            
            if (await nextModalPage.isVisible()) {
                console.log("Clicking next page...");
                await nextModalPage.click();
                await page.waitForTimeout(6000);
                continue;
            } else {
                throw new Error('No available active checkboxes found and no next page available!');
            }
        }
    
        const availableCheckbox = availableCheckboxes.first();
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
  await page.getByLabel('Aid', { exact: true }).getByText('BANTUAN RAMADHAN & HARI RAYA (FAKIR)').click();
  await page.locator('div:nth-child(4) > .formkit-wrapper > .formkit-inner > .formkit-select-search > .select-trigger > .iconify').click();
  await page.getByLabel('Aid Product', { exact: true }).getByText('RAMADHAN & HARI RAYA (FAKIR)').click();
  await page.getByRole('checkbox', { name: 'PEMBAYARAN TERUS (FAKIR)- TT' }).check();
  await page.waitForTimeout(5000);


await selectValidAsnafWithCheck1(page);
await page.waitForTimeout(10000);

  await page.getByRole('cell').first().click();
  await page.getByRole('button', { name: 'Simpan' }).click();
  await page.waitForTimeout(5000);
  await page.locator('a').nth(2).click();
  await page.waitForTimeout(5000);
  await page.locator('th:nth-child(7) > div > .flex > .inline-flex > .iconify').click();
  await page.waitForTimeout(5000);
  await page.locator('.inline-flex.items-center.justify-center.w-8.h-8.rounded.transition-colors.text-gray-600').first().click();
  await page.waitForTimeout(4000);

  await page.getByRole('button', { name: 'Hantar' }).click();
  await page.getByRole('button', { name: 'Ya, Hantar' }).click();
  await page.waitForTimeout(5000);
  await page.getByRole('button', { name: 'Log Keluar' }).click();

   //EKSEKUTIF PINDA

   await page.getByRole('textbox', { name: 'ID Pengguna' }).click();
   await page.getByRole('textbox', { name: 'ID Pengguna' }).fill('amanina.ar');
   await page.getByRole('textbox', { name: 'ID Pengguna' }).press('Tab');
   await page.getByRole('textbox', { name: 'Kata Laluan*' }).fill('Password123@');
   await page.getByRole('button', { name: 'Log Masuk', exact: true }).click();
   await page.getByRole('button', { name: 'Bantuan Utama' }).click();
   await page.locator('a').filter({ hasText: 'Senarai Bantuan Utama' }).click();
   await page.locator('th:nth-child(7) > div > .flex > .inline-flex > .iconify').click();
   await page.locator('.inline-flex.items-center.justify-center.w-8').first().click();
   
   await page.getByLabel('Status Semakan*').selectOption('PINDAAN_EOAD');
   await page.getByRole('textbox', { name: 'Catatan*' }).click();
   await page.getByRole('textbox', { name: 'Catatan*' }).fill('pindaan test');
   await page.getByRole('textbox', { name: 'Wajib diisi jika tidak' }).click();
   await page.getByRole('textbox', { name: 'Wajib diisi jika tidak' }).fill('catatan pinda');
   await page.getByRole('button', { name: 'Hantar' }).click();
   await page.getByRole('button', { name: 'Ya, Hantar' }).click();
 
   await page.waitForTimeout(5000);
   await page.getByRole('button', { name: 'Log Keluar' }).click();

//PTBTN hantar semula
await page.getByRole('textbox', { name: 'ID Pengguna' }).click();
  await page.getByRole('textbox', { name: 'ID Pengguna' }).fill('syafiq.a');
  await page.getByRole('textbox', { name: 'ID Pengguna' }).press('Tab');
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).fill('Password123@');
  await page.getByRole('button', { name: 'Log Masuk', exact: true }).click();
  await page.getByRole('button', { name: 'Tukar Peranan' }).click();
  await page.getByRole('menuitem', { name: 'PT_BTN' }).click();
  await page.getByRole('button', { name: 'Bantuan Utama' }).click();
  await page.locator('a').filter({ hasText: 'Senarai Bantuan Utama' }).click();
  await page.getByRole('button', { name: 'Pindaan' }).click();
  await page.locator('th:nth-child(7) > div > .flex > .inline-flex > .iconify').click();
  await page.waitForTimeout(1000);
  await page.locator('.inline-flex.items-center.justify-center.w-8.h-8.rounded.transition-colors.text-gray-600').first().click();
  await page.locator('.px-2 > .rounded').first().check();
  await page.getByRole('button', { name: 'Hantar' }).click();
  await page.getByRole('button', { name: 'Ya, Hantar' }).click();
  await page.waitForTimeout(5000);
  await page.getByRole('button', { name: 'Log Keluar' }).click();

  //Eksekutif

  await page.getByRole('textbox', { name: 'ID Pengguna' }).click();
  await page.getByRole('textbox', { name: 'ID Pengguna' }).fill('amanina.ar');
  await page.getByRole('textbox', { name: 'ID Pengguna' }).press('Tab');
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).fill('Password123@');
  await page.getByRole('button', { name: 'Log Masuk', exact: true }).click();
  await page.getByRole('button', { name: 'Bantuan Utama' }).click();
  await page.locator('a').filter({ hasText: 'Senarai Bantuan Utama' }).click();
  await page.locator('th:nth-child(7) > div > .flex > .inline-flex > .iconify').click();
  await page.locator('.inline-flex.items-center.justify-center.w-8').first().click();
  await page.getByLabel('Status Semakan*').selectOption('SOKONG');
  await page.getByRole('textbox', { name: 'Catatan*' }).click();
  await page.getByRole('textbox', { name: 'Catatan*' }).fill('catatan\n');
  await page.getByRole('textbox', { name: 'Wajib diisi jika tidak' }).click();
  await page.getByRole('textbox', { name: 'Wajib diisi jika tidak' }).fill('catatan');
  await page.getByRole('textbox', { name: 'Catatan*' }).click();
  await page.getByRole('textbox', { name: 'Catatan*' }).fill('catatan');
  await page.getByText('Status Semakan*-- Pilih Tindakan --SokongPindaanCatatan* Hantar').click();
  await page.locator('td input[type="checkbox"]').first().click();
  await page.getByRole('button', { name: 'Sahkan (1 dipilih)' }).click();
  await page.getByRole('button', { name: 'Ya, Sahkan' }).click();
  await page.getByRole('button', { name: 'Hantar' }).click();
  await page.getByRole('button', { name: 'Ya, Hantar' }).click();
  await page.waitForTimeout(5000);
  await page.getByRole('button', { name: 'Log Keluar' }).click();

    //KOAD PINDA
    await page.getByRole('textbox', { name: 'ID Pengguna' }).click();
    await page.getByRole('textbox', { name: 'ID Pengguna' }).fill('rizal79');
    await page.getByRole('textbox', { name: 'ID Pengguna' }).press('Tab');
    await page.getByRole('textbox', { name: 'Kata Laluan*' }).fill('Password123@');
    await page.getByRole('button', { name: 'Log Masuk', exact: true }).click();
    await page.getByRole('button', { name: 'Bantuan Utama' }).click();
    await page.locator('a').filter({ hasText: 'Senarai Bantuan Utama' }).click();
    await page.locator('th:nth-child(7) > div > .flex > .inline-flex > .iconify').click();
    await page.waitForTimeout(5000);
    await page.getByRole('button', { description: 'Lihat', exact: true }).click();
    await page.getByLabel('Status Kelulusan*').selectOption('PINDAAN_PELULUS');
    await page.getByRole('textbox', { name: 'Catatan*' }).click();
    await page.getByRole('textbox', { name: 'Catatan*' }).fill('test pinda');
    await page.getByRole('button', { name: 'Hantar' }).click();
    await page.getByRole('button', { name: 'Ya, Hantar' }).click();
    await page.waitForTimeout(5000);
    await page.getByRole('button', { name: 'Log Keluar' }).click();

    //Ekseskutif hantar semula
await page.getByRole('textbox', { name: 'ID Pengguna' }).click();
  await page.getByRole('textbox', { name: 'ID Pengguna' }).fill('amanina.ar');
  await page.getByRole('textbox', { name: 'ID Pengguna' }).press('Tab');
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).fill('Password123@');
  await page.getByRole('button', { name: 'Log Masuk', exact: true }).click();
  await page.getByRole('button', { name: 'Bantuan Utama' }).click();
  await page.locator('a').filter({ hasText: 'Senarai Bantuan Utama' }).click();
  await page.getByRole('button', { name: 'Pindaan Pelulus' }).click();
  await page.locator('.inline-flex.items-center.justify-center.w-8').first().click();
  await page.getByLabel('Status Semakan*').selectOption('SOKONG');
  await page.getByRole('textbox', { name: 'Catatan*' }).click();
  await page.getByRole('textbox', { name: 'Catatan*' }).fill('catatan');
  await page.getByRole('cell').first().click();
  await page.getByRole('button', { name: 'Sahkan' }).click();
  await page.getByRole('button', { name: 'Ya, Sahkan' }).click();
  await page.getByRole('button', { name: 'Hantar' }).click();
  await page.getByRole('button', { name: 'Ya, Hantar' }).click();
  await page.waitForTimeout(5000);
  await page.getByRole('button', { name: 'Log Keluar' }).click();

//KOAD

  await page.getByRole('textbox', { name: 'ID Pengguna' }).click();
  await page.getByRole('textbox', { name: 'ID Pengguna' }).fill('rizal79');
  await page.getByRole('textbox', { name: 'ID Pengguna' }).press('Tab');
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).fill('Password123@');
  await page.getByRole('button', { name: 'Log Masuk', exact: true }).click();
  await page.getByRole('button', { name: 'Bantuan Utama' }).click();
  await page.locator('a').filter({ hasText: 'Senarai Bantuan Utama' }).click();
  await page.locator('th:nth-child(6) > .flex.items-center.gap-2.text-left.justify-between > .flex > .inline-flex > .iconify').click();
  await page.locator('th:nth-child(7) > div > .flex > .inline-flex > .iconify').click();
  await page.locator('.inline-flex.items-center.justify-center.w-8').first().click();
  await page.getByLabel('Status Kelulusan*').selectOption('LULUS');
  await page.getByRole('textbox', { name: 'Catatan*' }).click();
  await page.getByRole('textbox', { name: 'Catatan*' }).fill('catatan');
  await page.getByRole('button', { name: 'Hantar' }).click();
  await page.getByRole('button', { name: 'Ya, Luluskan' }).click();

  await page.waitForTimeout(5000);
  await page.getByRole('button', { name: 'Log Keluar' }).click();

    //PT BTN check notification

    await page.getByRole('textbox', { name: 'ID Pengguna' }).click();
    await page.getByRole('textbox', { name: 'ID Pengguna' }).fill('syafiq.a');
    await page.getByRole('textbox', { name: 'ID Pengguna' }).press('Tab');
    await page.getByRole('textbox', { name: 'Kata Laluan*' }).fill('Password123@');
    await page.getByRole('button', { name: 'Log Masuk', exact: true }).click();
    await page.getByRole('button', { name: 'Tukar Peranan' }).click();
    await page.getByRole('menuitem', { name: 'PT_BTN' }).click();
    await page.getByRole('button', { name: 'Notifikasi' }).click();


// //PINDAAN

// //PT BTN
// await page.waitForTimeout(5000);
// await page.getByRole('textbox', { name: 'ID Pengguna' }).click();
//   await page.getByRole('textbox', { name: 'ID Pengguna' }).fill('syafiq.a');
//   await page.getByRole('textbox', { name: 'ID Pengguna' }).press('Tab');
//   await page.getByRole('textbox', { name: 'Kata Laluan*' }).fill('Password123@');
//   await page.getByRole('button', { name: 'Log Masuk', exact: true }).click();
//   await page.getByRole('button', { name: 'Tukar Peranan' }).click();
//   await page.getByRole('menuitem', { name: 'PT_BTN' }).click();
//   await page.getByRole('button', { name: 'Bantuan Utama' }).click();
//   await page.locator('a').filter({ hasText: 'Cipta Bantuan Raya' }).click();
//   await page.waitForTimeout(5000);
//   await page.locator('.iconify.i-heroicons\\:chevron-down').first().click();
//   await page.locator('span').filter({ hasText: 'BANTUAN RAMADHAN & HARI RAYA' }).first().click();
//   await page.locator('div:nth-child(4) > .formkit-wrapper > .formkit-inner > .formkit-select-search > .select-trigger > .iconify').click();
//   await page.getByLabel('Aid Product', { exact: true }).getByText('RAMADHAN & HARI RAYA (FAKIR)').click();
//   await page.getByText('PROGRAM DYMM (FAKIR) - TT (0').click();
//   await page.getByRole('button', { name: 'Pilih Asnaf' }).click();
//   await page.locator('.formkit-outer.formkit-outer-global.\\[\\&_\\.formkit-label\\]\\:font-semibold > .formkit-wrapper > .formkit-inner > .formkit-select-search > .select-trigger > .iconify').click();
//   await page.getByRole('option', { name: 'PETALING' }).click();
//   await page.getByText('Pilih satu atau lebih (kosong').click();
//   await page.getByRole('textbox', { name: 'Pilih satu atau lebih (kosong' }).fill('ria');
//   await page.getByRole('listbox').getByText('MASJID RIADHUS SOLIHIN, TAMAN').click();
//   await page.getByRole('button', { name: 'Cari' }).click();
//   await page.getByRole('checkbox', { name: 'Pilih' }).nth(3).check();
//   await page.getByRole('button', { name: 'Pilih', exact: true }).click();
//   await page.getByRole('cell').first().click();
//   await page.getByRole('button', { name: 'Simpan' }).click();
//   await page.waitForTimeout(5000);
//   await page.locator('a').nth(2).click();
//   await page.waitForTimeout(5000);
//   await page.locator('th:nth-child(7) > div > .flex > .inline-flex > .iconify').click();
//   await page.waitForTimeout(5000);
//   await page.locator('.inline-flex.items-center.justify-center.w-8.h-8.rounded.transition-colors.text-gray-600').first().click();
//   await page.getByRole('cell').first().click();
//   await page.getByRole('button', { name: 'Padam terpilih (1)' }).click();
//   await page.getByRole('button', { name: 'Ya, Padam' }).click();
//   await page.locator('.iconify.i-heroicons\\:chevron-down').first().click();
//   await page.locator('span').filter({ hasText: 'BANTUAN RAMADHAN & HARI RAYA' }).nth(2).click();
//   await page.locator('div:nth-child(4) > .formkit-wrapper > .formkit-inner > .formkit-select-search > .select-trigger > .iconify').click();
//   await page.locator('span').filter({ hasText: 'RAMADHAN & HARI RAYA (MISKIN)' }).nth(1).click();
//   await page.getByRole('checkbox', { name: 'PROGRAM DYMM (MISKIN) - TT (0' }).check();
//   await page.getByRole('button', { name: 'Pilih Asnaf' }).click();
//   await page.locator('.formkit-outer.formkit-outer-global.\\[\\&_\\.formkit-label\\]\\:font-semibold > .formkit-wrapper > .formkit-inner > .formkit-select-search > .select-trigger > .iconify').click();
//   await page.locator('span').filter({ hasText: 'HULU LANGAT' }).first().click();
//   await page.getByText('Pilih satu atau lebih (kosong').click();
//   await page.getByRole('textbox', { name: 'Pilih satu atau lebih (kosong' }).fill('ubudia');
//   await page.getByRole('listbox').getByText('MASJID UBUDIAH, KAMPUNG').click();
//   await page.getByRole('button', { name: 'Cari' }).click();
//   await page.getByRole('checkbox', { name: 'Pilih' }).nth(3).check();
//   await page.getByRole('button', { name: 'Pilih', exact: true }).click();
//   await page.getByRole('button', { name: 'Hantar' }).click();
//   await page.getByRole('button', { name: 'Ya, Hantar' }).click();
//   await page.waitForTimeout(5000);
//   await page.getByRole('button', { name: 'Log Keluar' }).click();

 







//   //eksekutif hantar semula
  
//   await page.getByRole('textbox', { name: 'ID Pengguna' }).click();
//   await page.getByRole('textbox', { name: 'ID Pengguna' }).fill('amanina.ar');
//   await page.getByRole('textbox', { name: 'ID Pengguna' }).press('Tab');
//   await page.getByRole('textbox', { name: 'Kata Laluan*' }).fill('Password123@');
//   await page.getByRole('button', { name: 'Log Masuk', exact: true }).click();
//   await page.getByRole('button', { name: 'Bantuan Utama' }).click();
//   await page.locator('a').filter({ hasText: 'Senarai Bantuan Utama' }).click();
//   await page.getByRole('button', { name: 'Pindaan Pelulus' }).click();
//   await page.getByRole('button', { description: 'Kemaskini', exact: true }).click();
//   await page.waitForTimeout(5000);
//   await page.locator('.inline-flex.items-center.justify-center.w-8').click();
//   await page.getByLabel('Status Semakan*').selectOption('SOKONG');
//   await page.getByRole('textbox', { name: 'Catatan*' }).click();
//   await page.getByRole('textbox', { name: 'Catatan*' }).fill('sokong hantar semula');
//   await page.getByRole('button', { name: 'Sahkan (1 dipilih)' }).click();
//   await page.getByRole('button', { name: 'Ya, Sahkan' }).click();
//   await page.getByRole('button', { name: 'Hantar' }).click();
//   await page.getByRole('button', { name: 'Ya, Hantar' }).click();
//   await page.waitForTimeout(5000);
//   await page.getByRole('button', { name: 'Log Keluar' }).click();

// //KOAD luluskan


//   await page.getByRole('textbox', { name: 'ID Pengguna' }).click();
//   await page.getByRole('textbox', { name: 'ID Pengguna' }).fill('rizal79');
//   await page.getByRole('textbox', { name: 'ID Pengguna' }).press('Tab');
//   await page.getByRole('textbox', { name: 'Kata Laluan*' }).fill('Password123@');
//   await page.getByRole('button', { name: 'Log Masuk', exact: true }).click();
//   await page.getByRole('button', { name: 'Bantuan Utama' }).click();
//   await page.locator('a').filter({ hasText: 'Senarai Bantuan Utama' }).click();
//   await page.locator('th:nth-child(7) > div > .flex > .inline-flex > .iconify').click();
//   await page.locator('.inline-flex.items-center.justify-center.w-8').first().click();
//   await page.getByLabel('Status Kelulusan*').selectOption('LULUS');
//   await page.getByRole('textbox', { name: 'Catatan*' }).click();
//   await page.getByRole('textbox', { name: 'Catatan*' }).fill('lulus');
//   await page.getByRole('button', { name: 'Hantar' }).click();
//   await page.getByRole('button', { name: 'Ya, Luluskan' }).click();
//   await page.waitForTimeout(5000);
//   await page.getByRole('button', { name: 'Log Keluar' }).click();

//   


});