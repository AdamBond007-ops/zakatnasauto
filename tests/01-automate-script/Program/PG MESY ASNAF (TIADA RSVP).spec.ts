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

// async function clickRsvpButton(page: Page) {
//   // Target all matching buttons in that container and pick the second one using .nth(1)
//   const secondButton = page.locator('.inline-flex.items-center.justify-center.w-8.h-8.rounded.transition-colors.text-gray-500.hover\\:text-primary.hover\\:bg-primary\\/10.disabled\\:opacity-50').nth(1);
  
//   // Hover first to trigger the tooltip
//   await secondButton.hover();
  
//   // Click the second button
//   await secondButton.click();
// }

test('test', async ({ page }) => {
  await page.goto('https://stg.nas-internal.com/login');
  await page.getByRole('textbox', { name: 'ID Pengguna' }).click();
  await page.getByRole('textbox', { name: 'ID Pengguna' }).fill('amanina.ar');
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).click();
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).fill('Password123@');
  await page.getByRole('button', { name: 'Log Masuk', exact: true }).click();

  await page.getByRole('button', { name: 'Tukar Peranan' }).click();
  await page.getByRole('menuitem', { name: 'EKSEKUTIF_PRG' }).click();

  await page.getByRole('button', { name: 'Program' }).click();
  await page.locator('a').filter({ hasText: 'Cipta Program' }).click();
  await page.locator('.iconify.i-heroicons\\:chevron-down').click();
  await page.locator('span').filter({ hasText: 'Mesyuarat/Program' }).first().click();
  await page.locator('.formkit-outer.formkit-outer-global.mb-4 > .formkit-wrapper > .formkit-inner > .formkit-select-search > .select-trigger > .iconify').click();
  await page.locator('span').filter({ hasText: 'Kursus' }).first().click();

  
    // 1. Generate and store the program name in a variable
const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
const programName = `TEST NO RSVP AUTO (${randomSuffix})`;

// 2. Click and fill the form field
await page.getByRole('textbox', { name: 'Nama Program*' }).click();
await page.getByRole('textbox', { name: 'Nama Program*' }).fill(programName);

// 3. Print to console
console.log(`Filled program name: ${programName}`);

  await page.getByRole('textbox', { name: 'Tempat Program*' }).click();
  await page.getByRole('textbox', { name: 'Tempat Program*' }).fill('TEST TEMPAt');
  await page.getByRole('textbox', { name: 'No Rumah / Lot / Blok' }).click();
  await page.getByRole('textbox', { name: 'No Rumah / Lot / Blok' }).fill('TEST TEMPAt');
  await page.getByRole('textbox', { name: 'Jalan / Lorong' }).click();
  await page.getByRole('textbox', { name: 'Jalan / Lorong' }).fill('TEST JALAn');
  await page.getByRole('textbox', { name: 'Kampung / Taman' }).click();
  await page.getByRole('textbox', { name: 'Kampung / Taman' }).fill('TESt');
  await page.locator('div:nth-child(7) > .formkit-wrapper > .formkit-inner').click();
  await page.getByRole('textbox', { name: 'Poskod*' }).fill('46200');
  await page.locator('div').filter({ hasText: /^Sila Pilih$/ }).click();
  await page.getByRole('textbox', { name: 'Sila Pilih' }).fill('riadhus');
  await page.getByRole('textbox', { name: 'Sila Pilih' }).press('Enter');
  await page.getByRole('textbox', { name: 'Radius Pengesahan Kehadiran (' }).click();
  await page.getByRole('textbox', { name: 'Radius Pengesahan Kehadiran (' }).fill('200');
  await page.getByRole('textbox', { name: 'Bilangan Peserta*' }).click();
  await page.getByRole('textbox', { name: 'Bilangan Peserta*' }).fill('20');
  await page.getByRole('checkbox', { name: 'Perlukan Respon Kehadiran (' }).uncheck();
  await page.getByRole('textbox', { name: 'Jumlah Hari Program*' }).click();
  await page.getByRole('textbox', { name: 'Jumlah Hari Program*' }).fill('1');
  await page.waitForTimeout(1000);

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
await page.locator('#input_21').fill(currentTime);
await page.locator('#input_22').fill(threeHoursLater);
        
  await page.getByRole('textbox', { name: 'Catatan*' }).click();
  await page.getByRole('textbox', { name: 'Catatan*' }).fill('catatan');

  await page.waitForTimeout(3000);
  await uploadTestingPdf(page);

  await page.getByRole('button', { name: 'Seterusnya' }).click();
  await page.getByRole('radio', { name: 'Asnaf' }).check();
  await page.getByRole('button', { name: 'Pilih Peserta' }).click();
  await page.locator('div').filter({ hasText: /^Sila Pilih$/ }).first().click();
  await page.locator('span').filter({ hasText: 'PETALING' }).nth(2).click();

  await page.getByRole('button', { name: 'Cari' }).click();
  await page.waitForTimeout(30000);

  await page.getByRole('searchbox', { name: 'Cari...' }).click();
  await page.getByRole('searchbox', { name: 'Cari...' }).fill('test automobile');
  await page.getByRole('checkbox', { name: 'Pilih', exact: true }).click();

  await page.getByRole('searchbox', { name: 'Cari...' }).click();
  await page.getByRole('searchbox', { name: 'Cari...' }).press('ControlOrMeta+a');
  await page.getByRole('searchbox', { name: 'Cari...' }).fill('');
  await page.waitForTimeout(5000);

  await page.getByRole('button', { name: '2', exact: true }).click();

  await page.getByRole('checkbox', { name: 'Pilih semua pada halaman ini' }).check();
  await page.getByRole('button', { name: 'Pilih Peserta' }).nth(1).click();
  await page.getByRole('button', { name: 'Seterusnya' }).click();
  await page.waitForTimeout(5000);

  await page.getByRole('button', { name: 'Hantar Program' }).click();
  await page.waitForTimeout(5000);

  await page.getByRole('button', { name: 'Log Keluar' }).click();
  

  
  await page.getByRole('textbox', { name: 'ID Pengguna' }).click();
  await page.getByRole('textbox', { name: 'ID Pengguna' }).fill('ellysuria');
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).click();
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).fill('Password123@');
  await page.getByRole('button', { name: 'Log Masuk', exact: true }).click();
  await page.getByRole('button', { name: 'Tukar Peranan' }).click();
  await page.getByRole('menuitem', { name: 'KJ' }).click();
  await page.waitForTimeout(3000);

  await page.getByRole('button', { name: 'Program' }).click();
  await page.locator('a').filter({ hasText: 'Senarai Kelulusan' }).click();
  await page.waitForTimeout(3000);
  // 1. Click and fill the search box using your locator
const searchBox = page.getByRole('searchbox', { name: 'Cari...' });
await searchBox.click();
await searchBox.fill(programName);

// 2. Press Enter or trigger the search filter
await searchBox.press('Enter');

  await clickSemakanButton(page);
  await page.waitForTimeout(3000);

  await page.locator('div').filter({ hasText: /^Sila Pilih$/ }).click();
  await page.locator('span').filter({ hasText: /^Lulus$/ }).first().click();
  await page.getByRole('textbox', { name: 'Catatan*' }).click();
  await page.getByRole('textbox', { name: 'Catatan*' }).fill('catatan');
  await page.getByRole('button', { name: 'Hantar' }).click();
  await page.waitForTimeout(5000);

  await page.getByRole('button', { name: 'Log Keluar' }).click();


  await page.getByRole('textbox', { name: 'ID Pengguna' }).click();
  await page.getByRole('textbox', { name: 'ID Pengguna' }).fill('020203010343');
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).click();
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).fill('Password123@');
  await page.getByRole('button', { name: 'Log Masuk', exact: true }).click();
  await page.getByRole('button', { name: 'Notifikasi' }).click();
  await page.getByRole('button', { name: 'Program', exact: true }).click();
  await page.locator('a').filter({ hasText: 'Jemputan' }).click();
  await page.waitForTimeout(3000);
  // 1. Click and fill the search box using your locator
  const searchBox2 = page.getByRole('searchbox', { name: 'Cari...' });
  await searchBox2.click();
  await searchBox2.fill(programName);

  // 2. Press Enter or trigger the search filter
  await searchBox2.press('Enter');
  await page.waitForTimeout(3000);

  await page.locator('.inline-flex.items-center.justify-center.w-8').click();
  await page.locator('.iconify.i-ic\\:round-close').click();
  await page.waitForTimeout(5000);

  await page.getByRole('button', { name: 'Log Keluar' }).click();


  await page.getByRole('textbox', { name: 'ID Pengguna' }).click();
  await page.getByRole('textbox', { name: 'ID Pengguna' }).fill('ellysuria');
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).click();
  await page.getByRole('textbox', { name: 'Kata Laluan*' }).fill('Password123@');
  await page.getByRole('button', { name: 'Log Masuk', exact: true }).click();
  await page.getByRole('button', { name: 'Tukar Peranan' }).click();
  await page.getByRole('menuitem', { name: 'PEGAWAI' }).click();
  await page.waitForTimeout(3000);
  
  await page.getByRole('button', { name: 'Program' }).click();
  await page.locator('a').filter({ hasText: 'Senarai Program' }).click();
 // 1. Click and fill the search box using your locator
  const searchBox3 = page.getByRole('searchbox', { name: 'Cari...' });
  await searchBox3.click();
  await searchBox3.fill(programName);

  // 2. Press Enter or trigger the search filter
  await searchBox3.press('Enter');
  await page.waitForTimeout(3000);
  await page.locator('.flex.items-center.justify-start > button:nth-child(2)').first().click();
  await page.getByRole('button', { name: 'QR Kehadiran' }).click();

});