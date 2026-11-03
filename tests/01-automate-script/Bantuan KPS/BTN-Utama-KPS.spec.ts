import { test, expect, Page } from '@playwright/test';
import path from 'path';

async function uploadTestingPdf(browserPage : Page) {
    const filePath = path.join(__dirname, 'testing.pdf');
  
    const fileChooserPromise = browserPage.waitForEvent('filechooser');
  
    await browserPage.locator('.flex > button:nth-child(3)').click();
  
    const fileChooser = await fileChooserPromise;
  
    await fileChooser.setFiles(filePath);
  }


  async function selectValidAsnafWithCheck(page: Page) {
    let selectedValid = false;
    let pageSkips = 0;    // Tracks which modal page we should be on
    let checkboxIndex = 0; // Tracks which checkbox index on that page

    // Helper function to open modal and apply PETALING filter
    async function openAndFilterModal() {
        await page.getByRole('button', { name: 'Pilih Asnaf' }).click();
        await page.waitForTimeout(6000);
        await page.locator('span').filter({ hasText: /^Sila Pilih$/ }).click();
        await page.locator('span').filter({ hasText: 'PETALING' }).first().click();
        await page.getByRole('button', { name: 'Cari' }).click();
        await page.waitForTimeout(10000); // Extended wait for table load
    }

    // 1. Open and filter modal once outside the loop
    await openAndFilterModal();

    while (!selectedValid) {
        const modal = page.locator('.swal2-popup, .modal, .modal-content, [role="dialog"]').last();
        
        // 2. Re-apply page skips if we are working on a later pagination page
        for (let i = 0; i < pageSkips; i++) {
            const nextModalPage = modal.locator('button:has-text(">"), a:has-text(">"), button:has-text("Next"), .pagination .next, [aria-label="Next"], button:nth-child(6)').last();
            if (await nextModalPage.isVisible() && await nextModalPage.isEnabled()) {
                await nextModalPage.click();
                await page.waitForTimeout(6000);
            } else {
                break;
            }
        }

        const availableCheckboxes = modal.locator('table tbody tr td:last-child input[type="checkbox"]:not(:checked):not(:disabled)');
        const count = await availableCheckboxes.count();
        
        // 3. If current page checkboxes are exhausted, move to the next page
        if (checkboxIndex >= count || count === 0) {
            console.log("All checkboxes on this page exhausted. Moving to next page...");
            const nextModalPage = modal.locator('button:has-text(">"), a:has-text(">"), button:has-text("Next"), .pagination .next, [aria-label="Next"], button:nth-child(6)').last();
            
            if (await nextModalPage.isVisible() && await nextModalPage.isEnabled()) {
                await nextModalPage.click();
                await page.waitForTimeout(6000);
                pageSkips++;      // Advance to the next page for future loops
                checkboxIndex = 0; // Reset checkbox index to 0 for the new page
                
                continue;
            } else {
                console.log('Warning: No more pages available.');
                break;
            }
        }

        // 4. Pick the specific checkbox using the incrementing checkboxIndex
        const availableCheckbox = availableCheckboxes.nth(checkboxIndex);
        await availableCheckbox.check();
        await page.waitForTimeout(6000);

        const pilihModalButton = modal.getByRole('button', { name: 'Pilih', exact: true });
        if (await pilihModalButton.isVisible()) {
            await pilihModalButton.click();
        } else {
            await page.getByRole('button', { name: 'Pilih', exact: true }).last().click();
        }
        
        await page.waitForTimeout(6000); // Wait for main table refresh

        // 5. Dynamically find "Jumlah" column index using the header loop
        const headers = page.locator('table thead th');
        const headerCount = await headers.count();
        let jumlahColIndex = -1;
        
        for (let i = 0; i < headerCount; i++) {
            const headerText = await headers.nth(i).textContent();
            if (headerText && headerText.includes('Jumlah')) {
                jumlahColIndex = i;
                break;
            }
        }

        if (jumlahColIndex === -1) {
            jumlahColIndex = 5; // Fallback index
        }

        // 6. Extract value from the main table row
        const mainTableRow = page.locator('table tbody tr').first();
        const jumlahText = await mainTableRow.locator('td').nth(jumlahColIndex).textContent(); 
        
        console.log(`Extracted Jumlah Text: "${jumlahText}"`);

        const cleanAmountStr = jumlahText?.replace(/[^\d.]/g, '') || '0';
        const cleanAmount = parseFloat(cleanAmountStr);

        console.log(`Parsed Clean Amount: ${cleanAmount}`);

        if (!isNaN(cleanAmount) && cleanAmount > 0) {
            console.log("Valid amount found (> 0). Exiting loop.");
            selectedValid = true;
            break; 
        } else {
            console.log("Amount is 0.00. Deleting entry, incrementing checkbox index, and reopening modal...");
            
            await mainTableRow.getByRole('checkbox').check();
            
            const deleteSelectedBtn = page.getByRole('button', { name: /^Padam terpilih/ });
            if (await deleteSelectedBtn.isVisible()) {
                await deleteSelectedBtn.click();
                await page.waitForTimeout(1000);
                
                const confirmDelete = page.getByRole('button', { name: 'Ya, Padam' });
                if (await confirmDelete.isVisible()) {
                    await confirmDelete.click();
                }
                await page.waitForTimeout(6000);
            }

            // 7. Increment checkboxIndex so the next iteration targets the next row down
            checkboxIndex++; 

            // 8. Re-open and re-filter modal after deletion to continue searching
            await openAndFilterModal();
        }
    }
}

//   async function selectValidAsnafWithCheck(page: Page) {
//     let selectedValid = false;
//     let retryCount = 0; // Added: tracks how many times we've deleted so we can skip ahead in pagination
    
//     // 1. Open "Pilih Asnaf" modal
//     await page.getByRole('button', { name: 'Pilih Asnaf' }).click();
//     await page.waitForTimeout(6000);

//     // 2. Filter by HULU LANGAT
//     await page.locator('span').filter({ hasText: /^Sila Pilih$/ }).click();
//     await page.locator('span').filter({ hasText: 'HULU LANGAT' }).first().click();
//     await page.getByRole('button', { name: 'Cari' }).click();
//     await page.waitForTimeout(9000);

//     while (!selectedValid) {
//         const modal = page.locator('.swal2-popup, .modal, .modal-content, [role="dialog"]').last();
        
//         // Added: Automatically click the modal's next page based on how many times a delete/retry happened
//         for (let p = 0; p < retryCount; p++) {
//             const nextModalPage = modal.locator('button:has-text(">"), a:has-text(">"), button:has-text("Next"), .pagination .next, [aria-label="Next"], button:nth-child(6)').last();
//             if (await nextModalPage.isVisible() && await nextModalPage.isEnabled()) {
//                 console.log(`Advancing modal page for retry attempt ${retryCount} (Hop ${p + 1})...`);
//                 await nextModalPage.click();
//                 await page.waitForTimeout(6000);
//             } else {
//                 console.log("Reached the end of modal pages during pagination skip.");
//                 break;
//             }
//         }
        
//         const availableCheckboxes = modal.locator('table tbody tr td:last-child input[type="checkbox"]:not(:checked):not(:disabled)');
//         const count = await availableCheckboxes.count();
        
//         if (count === 0) {
//             const nextModalPage = modal.locator('button:has-text(">"), a:has-text(">"), button:has-text("Next"), .pagination .next, [aria-label="Next"], button:nth-child(6)').last();
            
//             if (await nextModalPage.isVisible() && await nextModalPage.isEnabled()) {
//                 await nextModalPage.click();
//                 await page.waitForTimeout(9000);
//                 continue;
//             } else {
//                 console.log('Warning: No available active checkboxes found in the last column and no next page available. Exiting modal loop.');
//                 break;
//             }
//         }

//         // Pick the second checkbox (.nth(1)) if available to avoid re-selecting the top item that keeps resetting, otherwise first
//         const availableCheckbox = count > 1 ? availableCheckboxes.nth(1) : availableCheckboxes.first();

//         // Check the box in the last column and submit modal selection
//         await availableCheckbox.check();
//         await page.waitForTimeout(6000);

//         const pilihModalButton = modal.getByRole('button', { name: 'Pilih', exact: true });
//         if (await pilihModalButton.isVisible()) {
//             await pilihModalButton.click();
//         } else {
//             await page.getByRole('button', { name: 'Pilih', exact: true }).last().click();
//         }
        
//         await page.waitForTimeout(6000); // Wait for main table refresh

//         // 4. Dynamically find the "Jumlah (RM)" column index from main table headers
//         const headers = page.locator('table thead th');
//         const headerCount = await headers.count();
//         let jumlahColIndex = -1;
        
//         for (let i = 0; i < headerCount; i++) {
//             const headerText = await headers.nth(i).textContent();
//             if (headerText && headerText.includes('Jumlah')) {
//                 jumlahColIndex = i;
//                 break;
//             }
//         }

//         if (jumlahColIndex === -1) {
//             jumlahColIndex = 5; // Fallback index
//         }

//         // 5. Extract value dynamically using the located column index
//         const mainTableRow = page.locator('table tbody tr').first();
//         const jumlahText = await mainTableRow.locator('td').nth(jumlahColIndex).textContent(); 
        
//         console.log(`Extracted Jumlah Text: "${jumlahText}"`);

//         const cleanAmountStr = jumlahText?.replace(/[^\d.]/g, '') || '0';
//         const cleanAmount = parseFloat(cleanAmountStr);

//         console.log(`Parsed Clean Amount: ${cleanAmount}`);

//         if (!isNaN(cleanAmount) && cleanAmount > 0) {
//             console.log("Valid amount found (> 0). Exiting loop.");
//             selectedValid = true;
//             break; 
//         } else {
//             console.log("Amount is 0.00 or invalid. Deleting entry and trying next...");
            
//             await mainTableRow.getByRole('checkbox').check();
            
//             const deleteSelectedBtn = page.getByRole('button', { name: /^Padam terpilih/ });
//             if (await deleteSelectedBtn.isVisible()) {
//                 await deleteSelectedBtn.click();
//                 await page.waitForTimeout(1000);
                
//                 const confirmDelete = page.getByRole('button', { name: 'Ya, Padam' });
//                 if (await confirmDelete.isVisible()) {
//                     await confirmDelete.click();
//                 }
//                 await page.waitForTimeout(6000);

//                 // Re-open modal and re-apply filter to pick the next candidate
//                 await page.getByRole('button', { name: 'Pilih Asnaf' }).click();
//                 await page.waitForTimeout(6000);
//                 await page.locator('span').filter({ hasText: /^Sila Pilih$/ }).click();
//                 await page.locator('span').filter({ hasText: 'HULU LANGAT' }).first().click();
//                 await page.getByRole('button', { name: 'Cari' }).click();
//                 await page.waitForTimeout(6000);
//             }

//             retryCount++; // Added: Increments the counter so the next loop skips ahead in pagination to avoid picking from the same spot
//         }
//     }
// }

//   async function selectValidAsnafWithCheck(page: Page) {
//     let selectedValid = false;
    
//     // 1. Open "Pilih Asnaf" modal
//     await page.getByRole('button', { name: 'Pilih Asnaf' }).click();
//     await page.waitForTimeout(6000);

//     // 2. Filter by HULU LANGAT
//     await page.locator('span').filter({ hasText: /^Sila Pilih$/ }).click();
//     await page.locator('span').filter({ hasText: 'HULU LANGAT' }).first().click();
//     await page.getByRole('button', { name: 'Cari' }).click();
//     await page.waitForTimeout(9000);

//     while (!selectedValid) {
//         const modal = page.locator('.swal2-popup, .modal, .modal-content, [role="dialog"]').last();
        
//         const availableCheckboxes = modal.locator('table tbody tr td:last-child input[type="checkbox"]:not(:checked):not(:disabled)');
//         const count = await availableCheckboxes.count();
        
//         if (count === 0) {
//             const nextModalPage = modal.locator('button:has-text(">"), a:has-text(">"), button:has-text("Next"), .pagination .next, [aria-label="Next"], button:nth-child(6)').last();
            
//             if (await nextModalPage.isVisible() && await nextModalPage.isEnabled()) {
//                 await nextModalPage.click();
//                 await page.waitForTimeout(9000);
//                 continue;
//             } else {
//                 console.log('Warning: No available active checkboxes found in the last column and no next page available. Exiting modal loop.');
//                 break;
//             }
//         }

//         // Pick the second checkbox (.nth(1)) if available to avoid re-selecting the top item that keeps resetting, otherwise first
//         const availableCheckbox = count > 1 ? availableCheckboxes.nth(1) : availableCheckboxes.first();

//         // Check the box in the last column and submit modal selection
//         await availableCheckbox.check();
//         await page.waitForTimeout(6000);

//         const pilihModalButton = modal.getByRole('button', { name: 'Pilih', exact: true });
//         if (await pilihModalButton.isVisible()) {
//             await pilihModalButton.click();
//         } else {
//             await page.getByRole('button', { name: 'Pilih', exact: true }).last().click();
//         }
        
//         await page.waitForTimeout(6000); // Wait for main table refresh

//         // 4. Dynamically find the "Jumlah (RM)" column index from main table headers
//         const headers = page.locator('table thead th');
//         const headerCount = await headers.count();
//         let jumlahColIndex = -1;
        
//         for (let i = 0; i < headerCount; i++) {
//             const headerText = await headers.nth(i).textContent();
//             if (headerText && headerText.includes('Jumlah')) {
//                 jumlahColIndex = i;
//                 break;
//             }
//         }

//         if (jumlahColIndex === -1) {
//             jumlahColIndex = 5; // Fallback index
//         }

//         // 5. Extract value dynamically using the located column index
//         const mainTableRow = page.locator('table tbody tr').first();
//         const jumlahText = await mainTableRow.locator('td').nth(jumlahColIndex).textContent(); 
        
//         console.log(`Extracted Jumlah Text: "${jumlahText}"`);

//         const cleanAmountStr = jumlahText?.replace(/[^\d.]/g, '') || '0';
//         const cleanAmount = parseFloat(cleanAmountStr);

//         console.log(`Parsed Clean Amount: ${cleanAmount}`);

//         if (!isNaN(cleanAmount) && cleanAmount > 0) {
//             console.log("Valid amount found (> 0). Exiting loop.");
//             selectedValid = true;
//             break; 
//         } else {
//             console.log("Amount is 0.00 or invalid. Deleting entry and trying next...");
            
//             await mainTableRow.getByRole('checkbox').check();
            
//             const deleteSelectedBtn = page.getByRole('button', { name: /^Padam terpilih/ });
//             if (await deleteSelectedBtn.isVisible()) {
//                 await deleteSelectedBtn.click();
//                 await page.waitForTimeout(1000);
                
//                 const confirmDelete = page.getByRole('button', { name: 'Ya, Padam' });
//                 if (await confirmDelete.isVisible()) {
//                     await confirmDelete.click();
//                 }
//                 await page.waitForTimeout(6000);

//                 // Re-open modal and re-apply filter to pick the next candidate
//                 await page.getByRole('button', { name: 'Pilih Asnaf' }).click();
//                 await page.waitForTimeout(6000);
//                 await page.locator('span').filter({ hasText: /^Sila Pilih$/ }).click();
//                 await page.locator('span').filter({ hasText: 'PETALING' }).first().click();
//                 await page.getByRole('button', { name: 'Cari' }).click();
//                 await page.waitForTimeout(6000);
//             }
//         }
//     }
// }

test('test', async ({ page }) => {
  await page.goto('https://stg.nas-internal.com/login');
  await page.getByRole('textbox', { name: 'ID Pengguna' }).click();
  await page.getByRole('textbox', { name: 'ID Pengguna' }).fill('syafiq.a');
  await page.getByRole('textbox', { name: 'ID Pengguna' }).press('Tab');
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).fill('Password123@');
  await page.getByRole('button', { name: 'Log Masuk', exact: true }).click();
  await page.getByRole('button', { name: 'Tukar Peranan' }).click();
  await page.getByRole('menuitem', { name: 'PT_BTN' }).click();
  await page.getByRole('button', { name: 'Tuntutan' }).click();
  await page.getByRole('button', { name: 'Tuntutan' }).click();
  await page.getByRole('button', { name: 'Bantuan Utama' }).click();
  await page.locator('a').filter({ hasText: 'Cipta Bantuan KPS' }).click();
  await page.locator('.iconify.i-heroicons\\:chevron-down').click();
  await page.locator('span').filter({ hasText: 'Fakir' }).first().click();
  await page.getByRole('textbox', { name: 'Tarikh Mula*' }).fill('2026-09-5');
  await page.getByRole('textbox', { name: 'Tarikh Tamat*' }).click();
  await page.getByRole('textbox', { name: 'Tarikh Tamat*' }).fill('2026-09-26');
  
//   await page.getByRole('button', { name: 'Pilih Asnaf' }).click();
//   await page.locator('span').filter({ hasText: /^Sila Pilih$/ }).click();
//   await page.locator('span').filter({ hasText: 'PETALING' }).first().click();
//   await page.getByRole('button', { name: 'Cari' }).click();
//   await page.waitForTimeout(10000);
  
  // Find and check the first available empty (unchecked) checkbox in the table's "Pilih" column
  await selectValidAsnafWithCheck(page);
  await page.waitForTimeout(10000);
//   const targetCheckbox = page.locator('tbody tr input[type="checkbox"]:not(:checked):not(:disabled)').first();
// await targetCheckbox.check();

  

//   await page.getByRole('button', { name: 'Pilih Asnaf' }).click();
//   await page.locator('span').filter({ hasText: /^Sila Pilih$/ }).click();
//   await page.locator('span').filter({ hasText: 'PETALING' }).first().click();
//   await page.getByRole('button', { name: 'Cari' }).click();
//   await page.getByRole('checkbox', { name: 'Pilih' }).nth(3).check();
//   await page.getByRole('button', { name: 'Pilih', exact: true }).click();

  
  await uploadTestingPdf(page);

  await page.getByRole('button', { name: 'Simpan' }).click();
  await page.waitForTimeout(5000);
  await page.locator('a').nth(2).click();
  await page.waitForTimeout(5000);
  await page.locator('th:nth-child(7) > div > .flex > .inline-flex > .iconify').click();
  await page.waitForTimeout(5000);

    const pencilIcon = page.locator('table tbody tr').first().locator('td:last-child button, td:last-child a, .fa-pencil, [title*="Kemaskini"]').last();

    await pencilIcon.hover();
    await page.waitForTimeout(500); // Short stabilization wait after hovering
    await pencilIcon.click();

  await page.waitForTimeout(5000);
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
  const actionButton = page.getByRole('row').nth(1).locator('td').last().getByRole('button');
    await actionButton.hover();
    await actionButton.click();
  await page.locator('.px-2 > .rounded').first().check();
  await page.getByRole('button', { name: 'Sahkan (1 dipilih)' }).click();
  await page.getByRole('button', { name: 'Ya, Sahkan' }).click();
  await page.locator('.px-3 > .formkit-outer > .formkit-wrapper > .formkit-inner > .formkit-select-search > .select-trigger > .iconify').click();
  await page.locator('span').filter({ hasText: 'Lengkap' }).first().click();
  await page.getByRole('combobox').selectOption('SOKONG');
  await page.getByRole('textbox', { name: 'Masukkan catatan...' }).click();
  await page.getByRole('textbox', { name: 'Masukkan catatan...' }).fill('catatan');
  await page.getByRole('button', { name: 'Hantar' }).click();
  await page.getByRole('button', { name: 'Ya, Hantar' }).click();
  await page.getByRole('button', { name: 'OK' }).click();
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
  await page.locator('th:nth-child(7) > div > .flex > .inline-flex > .iconify').click();
  const actionButton1 = page.getByRole('row').nth(1).locator('td').last().getByRole('button');
    await actionButton1.hover();
    await actionButton1.click();
    await page.waitForTimeout(15000);
  await page.getByRole('combobox').selectOption('LULUS');
  await page.getByRole('textbox', { name: 'Masukkan catatan...' }).click();
  await page.getByRole('textbox', { name: 'Masukkan catatan...' }).fill('LULUSSSS');
  await page.getByRole('button', { name: 'Hantar' }).click();
  await page.getByRole('button', { name: 'Ya, Hantar' }).click();
  await page.waitForTimeout(30000);
  await page.getByRole('button', { name: 'OK' }).click();
  await page.waitForTimeout(5000);
  await page.getByRole('button', { name: 'Log Keluar' }).click();

    await page.getByRole('textbox', { name: 'ID Pengguna' }).fill('syafiq.a');
    await page.getByRole('textbox', { name: 'ID Pengguna' }).press('Tab');
    await page.getByRole('textbox', { name: 'Kata Laluan*' }).fill('Password123@');
    await page.getByRole('button', { name: 'Log Masuk', exact: true }).click();
    await page.getByRole('button', { name: 'Tukar Peranan' }).click();
    await page.getByRole('menuitem', { name: 'PT_BTN' }).click();
    await page.getByRole('button', { name: 'Notifikasi' }).click();

});