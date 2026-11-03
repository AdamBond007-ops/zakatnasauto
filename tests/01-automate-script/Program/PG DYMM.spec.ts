import { test, expect, Page } from '@playwright/test';
import path from 'path';


async function uploadTestingPdf(browserPage: Page) {
    const filePath = path.join(__dirname, 'testing.pdf');

    // 1. Set up the waitForEvent promise *before* clicking, and use Promise.all to handle it properly
    const [fileChooser] = await Promise.all([
        browserPage.waitForEvent('filechooser'),
        browserPage.getByRole('button', { name: 'Pilih Fail' }).click() // Updated locator matching your button text
    ]);

    // 2. Upload the file once the file chooser opens
    await fileChooser.setFiles(filePath);
}

async function clickSemakanButton(page: Page) {
  const button = page.locator('.inline-flex.items-center.justify-center.w-8').first();
  
  // Hover first to trigger the tooltip / enable state
  await button.hover();
  
  // Click the button
  await button.click();
}

test('test', async ({ page }) => {

    //eksekutif

  await page.goto('https://stg.nas-internal.com/login');
  await page.getByRole('textbox', { name: 'ID Pengguna' }).click();
  await page.getByRole('textbox', { name: 'ID Pengguna' }).fill('amanina.ar');
  await page.getByRole('textbox', { name: 'ID Pengguna' }).press('Tab');
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).fill('Password123@');
  await page.getByRole('button', { name: 'Log Masuk', exact: true }).click();
  await page.getByRole('button', { name: 'Tukar Peranan' }).click();
  await page.getByRole('menuitem', { name: 'EKSEKUTIF_PRG' }).click();
  await page.getByRole('button', { name: 'Program' }).click();
  await page.locator('a').filter({ hasText: 'Cipta Program' }).click();
  await page.locator('div').filter({ hasText: /^Sila Pilih$/ }).click();
  await page.locator('span').filter({ hasText: 'DYMM' }).first().click();

 // 1. Generate and store the program name in a variable
 const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
 const programName = `TEST DYMM AUTO (${randomSuffix})`;
 
 // 2. Click and fill the form field
 await page.getByRole('textbox', { name: 'Nama Program*' }).click();
 await page.getByRole('textbox', { name: 'Nama Program*' }).fill(programName);
 
 // 3. Print to console
 console.log(`Filled program name: ${programName}`);

  await page.getByText('Sila Pilih').first().click();
  await page.getByRole('textbox', { name: 'Sila Pilih' }).fill('riadhus');
  await page.getByRole('listbox').getByText('MASJID RIADHUS SOLIHIN, TAMAN').click();
  await page.getByRole('textbox', { name: 'Kampung / Taman' }).click();
  await page.getByRole('textbox', { name: 'Kampung / Taman' }).fill('HHHHh');
  await page.getByRole('textbox', { name: 'Bilangan Peserta*' }).click();
  await page.getByRole('textbox', { name: 'Bilangan Peserta*' }).fill('20');
  await page.getByRole('checkbox', { name: 'Perlukan Respon Kehadiran (' }).check();
  await page.getByRole('textbox', { name: 'Radius Pengesahan Kehadiran (' }).click();
  await page.getByRole('textbox', { name: 'Radius Pengesahan Kehadiran (' }).fill('100');
  await page.getByRole('textbox', { name: 'Jumlah Hari Program*' }).click();
  await page.getByRole('textbox', { name: 'Jumlah Hari Program*' }).fill('1');
   // 1. Click the "Tarikh Mula" input box to open the calendar popup
await page.getByRole('textbox', { name: 'Tarikh Mula*' }).click();

// 2. Calculate the target date (2 days in the future)
const now = new Date();
const targetDate = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
const dayNumber = targetDate.getDate();
const monthName = targetDate.toLocaleDateString('en-US', { month: 'short' });

// 3. Click the button for 2 days later inside the calendar
await page.getByRole('button', { name: new RegExp(`${dayNumber}.*${monthName}`, 'i') }).click();

const formatTime = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
};

const currentTime = formatTime(now);
const laterDate = new Date(now.getTime() + 3 * 60 * 60 * 1000);
const threeHoursLater = formatTime(laterDate);

// Fill time inputs
await page.locator('#input_22').fill(currentTime);
await page.locator('#input_23').fill(threeHoursLater);


  await page.getByRole('textbox', { name: 'Catatan*' }).click();
  await page.getByRole('textbox', { name: 'Catatan*' }).fill('catatan');


  await page.waitForTimeout(3000);
  await uploadTestingPdf(page);

  await page.getByRole('button', { name: 'Seterusnya' }).click();
  await page.getByRole('button', { name: 'Pilih Peserta' }).click();
  await page.getByText('Sila Pilih').first().click();
  await page.locator('span').filter({ hasText: 'PETALING' }).first().click();
  await page.getByRole('button', { name: 'Cari' }).click();
  await page.getByRole('searchbox', { name: 'Cari...' }).click();
  await page.getByRole('searchbox', { name: 'Cari...' }).fill('test btn teknikal');
  await page.getByRole('checkbox', { name: 'Pilih', exact: true }).click();
  await page.getByRole('searchbox', { name: 'Cari...' }).click();
  await page.getByRole('searchbox', { name: 'Cari...' }).press('ControlOrMeta+a');
  await page.getByRole('searchbox', { name: 'Cari...' }).fill('');


  await page.getByRole('button', { name: '3', exact: true }).click();
  await page.getByRole('checkbox', { name: 'Pilih semua pada halaman ini' }).check();
  await page.getByRole('button', { name: 'Pilih Peserta' }).nth(1).click();
  await page.getByRole('button', { name: 'Seterusnya' }).click();
  await page.getByRole('button', { name: 'Tambah' }).click();

  await page.locator('div').filter({ hasText: /^Sila Pilih$/ }).first().click();
  await page.locator('span').filter({ hasText: '(HQ) WANG FIDYAH' }).first().click();
  await page.locator('div').filter({ hasText: /^Sila Pilih$/ }).first().click();
  await page.getByRole('option', { name: '(HQ) WANG FIDYAH' }).click();
  await page.locator('div').filter({ hasText: /^Sila Pilih$/ }).click();
  await page.locator('span').filter({ hasText: '(PEROLEHAN) (HQ) WANG FIDYAH' }).first().click();
  await page.locator('.w-4.h-4.border').click();
  await page.getByRole('button', { name: 'Edit' }).click();
  await page.getByRole('textbox', { name: 'Amaun (RM)*' }).click();
  await page.getByRole('textbox', { name: 'Amaun (RM)*' }).fill('100');

  await page.locator('div').filter({ hasText: /^Sila Pilih$/ }).first().click();
  await page.locator('span').filter({ hasText: /^1$/ }).nth(2).click();
  await page.getByRole('textbox', { name: 'Tarikh Mula*' }).click();
  await page.getByRole('button', { name: 'Wednesday, 23 Sept' }).click();
  await page.locator('div').filter({ hasText: /^Sila Pilih$/ }).click();
  await page.locator('span').filter({ hasText: 'Asnaf' }).nth(5).click();
  await page.locator('div').filter({ hasText: /^Sila Pilih$/ }).click();
  await page.locator('span').filter({ hasText: 'eWallet' }).first().click();
  await page.getByRole('button', { name: 'Simpan' }).nth(1).click();
  await page.getByRole('button', { name: 'Tambah' }).nth(1).click();
  await page.getByRole('button', { name: 'Hantar Program' }).click();

  await page.waitForTimeout(3000);
  await page.getByRole('button', { name: 'Log Keluar' }).click();

    //kj

  await page.getByRole('textbox', { name: 'ID Pengguna' }).click();
  await page.getByRole('textbox', { name: 'ID Pengguna' }).fill('ellysuria');
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).click();
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).fill('Password123@');
  await page.getByRole('button', { name: 'Log Masuk', exact: true }).click();
  await page.getByRole('button', { name: 'Tukar Peranan' }).click();
  await page.getByRole('menuitem', { name: 'KJ' }).click();
  await page.getByRole('button', { name: 'Program' }).click();
  await page.locator('a').filter({ hasText: 'Senarai Kelulusan' }).click();
   // 1. Click and fill the search box using your locator
const searchBox = page.getByRole('searchbox', { name: 'Cari...' });
await searchBox.click();
await searchBox.fill(programName);

// 2. Press Enter or trigger the search filter
await searchBox.press('Enter');

  await clickSemakanButton(page);
  await page.waitForTimeout(3000);
  await page.locator('#kelulusan-program-tindakan-form div').filter({ hasText: /^Sila Pilih$/ }).click();
  await page.locator('span').filter({ hasText: /^Lulus$/ }).first().click();
  await page.getByRole('textbox', { name: 'Catatan*' }).click();
  await page.getByRole('textbox', { name: 'Catatan*' }).fill('lulus');
  await page.getByRole('button', { name: 'Hantar' }).click();
  await page.waitForTimeout(3000);

  await page.getByRole('button', { name: 'Log Keluar' }).click();

//asnaf

  await page.getByRole('textbox', { name: 'ID Pengguna' }).click();
  await page.getByRole('textbox', { name: 'ID Pengguna' }).fill('011222010345');
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).click();
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).fill('Password123@');
  await page.getByRole('button', { name: 'Log Masuk', exact: true }).click();
  await page.getByRole('button', { name: 'Notifikasi' }).click();
  await page.getByRole('button', { name: 'Program', exact: true }).click();
  await page.locator('a').filter({ hasText: 'Jemputan' }).click();
  await page.waitForTimeout(3000);
  // 1. Click and fill the search box using your locator
  const searchBox4 = page.getByRole('searchbox', { name: 'Cari...' });
  await searchBox4.click();
  await searchBox4.fill(programName);

  // 2. Press Enter or trigger the search filter
  await searchBox4.press('Enter');
  await page.waitForTimeout(3000);

  await page.locator('.inline-flex.items-center.justify-center.w-8.h-8.rounded.transition-colors.text-gray-500.hover\\:text-primary.hover\\:bg-primary\\/10.disabled\\:opacity-50').first().click();
  await page.getByRole('button', { name: 'Hantar Jawapan' }).click();
  await page.waitForTimeout(5000);

  await page.getByRole('button', { name: 'Log Keluar' }).click();

//kj

  await page.getByRole('textbox', { name: 'ID Pengguna' }).click();
  await page.getByRole('textbox', { name: 'ID Pengguna' }).fill('ellysuria');
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).click();
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).fill('Password123@');
  await page.getByRole('button', { name: 'Log Masuk', exact: true }).click();
  await page.getByRole('button', { name: 'Tukar Peranan' }).click();
  await page.getByRole('menuitem', { name: 'PEGAWAI' }).click();
  await page.waitForTimeout(5000);

  await page.getByRole('button', { name: 'Program' }).click();
  await page.locator('a').filter({ hasText: 'Senarai Program' }).click();

  // 1. Click and fill the search box using your locator
    const searchBox2 = page.getByRole('searchbox', { name: 'Cari...' });
    await searchBox2.click();
    await searchBox2.fill(programName);

    // 2. Press Enter or trigger the search filter
    await searchBox2.press('Enter');
  await page.locator('.flex.items-center.justify-start > button:nth-child(4)').first().click();
  await page.getByRole('checkbox', { name: 'Papar semua penerima (' }).check();

  await page.locator('.inline-flex.items-center.justify-center.w-8.h-8.rounded.transition-colors.text-gray-500.hover\\:text-green-600').first().click();
  await page.getByRole('button', { name: 'Ya, Tandakan Diterima' }).click();
  await page.waitForTimeout(5000);

  await page.locator('.inline-flex.items-center.justify-center.w-8.h-8.rounded.transition-colors.text-gray-500.hover\\:text-green-600').first().click();
  await page.getByRole('button', { name: 'Ya, Tandakan Diterima' }).click();
  await page.waitForTimeout(5000);

  await page.locator('tr:nth-child(3) > td:nth-child(16) > .flex > .inline-flex.items-center.justify-center.w-8.h-8.rounded.transition-colors.text-gray-500.hover\\:text-green-600').first().click();
  await page.getByRole('button', { name: 'Ya, Tandakan Diterima' }).click();
  await page.waitForTimeout(5000);    
  
  await page.getByRole('button', { name: 'Kembali' }).click();
  await page.waitForTimeout(5000);

  const searchBox3 = page.getByRole('searchbox', { name: 'Cari...' });
    await searchBox3.click();
    await searchBox3.fill(programName);

    // 2. Press Enter or trigger the search filter
    await searchBox3.press('Enter');

  await page.locator('.flex.items-center > button:nth-child(5)').first().click();
  await page.getByRole('button', { name: 'Ya, tandakan selesai' }).click();

  await page.waitForTimeout(5000);
  await page.getByRole('button', { name: 'Selesai' }).click();
   // 1. Click and fill the search box using your locator
    

  await page.locator('.flex.items-center.justify-start > button:nth-child(4)').first().click();


});