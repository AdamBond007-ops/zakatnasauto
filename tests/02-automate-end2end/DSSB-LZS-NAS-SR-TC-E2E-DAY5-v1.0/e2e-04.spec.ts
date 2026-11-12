import path from 'path';
import { test, expect } from '@playwright/test';
import { PendaftaranPantasPukalAction } from '@library/2-object/Pendaftaran Pukal/action';
import { LoginAction } from '@library/2-object/Login/action';
import { AduanAction } from '@library/2-object/Pendaftaran Lengkap/action';

test('test', async ({ page }) => {
  await page.goto('https://stg.nas-internal.com/login');

//---------------
// PT Bantuan 
//---------------

  const login = new LoginAction(page);
  
      await login.goto();
      await login.fillIdPengguna('rosnizamusa');
      await login.fillKataLaluan('Password123@');
      await login.clickLogMasuk();
      await page.waitForLoadState('load');
  
  const action = new PendaftaranPantasPukalAction(page);
  const aduan = new AduanAction(page);

await action.navigateToCiptaBulkProcessing();

await action.fillBulkProcessingForm();

await action.fillMaklumatBantuanAndTarikh(
  'B104 - (HQ) BANTUAN KEPERLUAN HIDUP (FAKIR)',
  '002 - (HQ) KATEGORI MAKAN/MINUM (FAKIR)',
  '20200000027 - (HQ) KATEGORI MAKAN/MINUM (FAKIR)',
  '(HQ) KATEGORI MAKAN/MINUM (FAKIR)',
  '2026-11-12'
);
await action.clickEdit();
await action.uploadExcelFile(path.join(__dirname, 'Template_Bantuan_Pukal.xlsx'));

// 1. Open the modal
await action.clickTambahBayaranKepada();

// 2. Generate a random 3-digit number (100 - 999)
const randomInvoice = Math.floor(100 + Math.random() * 900).toString();

// 3. Fill and submit
await action.addBayaranKepadaAsnaf('790714078941', randomInvoice);

await action.clickSimpan();

// await aduan.yaHantar();
await login.logout();

//---------------
// EOAD Sokong
//---------------

// await login.goto();
//       await login.fillIdPengguna('habibullah');
//       await login.fillKataLaluan('Password123@');
//       await login.clickLogMasuk();
//       await page.waitForLoadState('load');

// await action.navigateToSenaraiBulkProcessing();

// // Click "Semakan" once. The first click opens the review page.
// await action.clickSemakanInRow(0);

// await action.completeSemakanFlow('Semua dokumen lengkap dan disahkan.');



// await aduan.yaHantar();

// await login.logout();


// //---------------
// // KOAD Lulus
// //---------------

// await login.goto();
//       await login.fillIdPengguna('m.sharil');
//       await login.fillKataLaluan('Password123@');
//       await login.clickLogMasuk();
//       await page.waitForLoadState('load');

// await action.navigateToSenaraiBulkProcessing();
// await action.clickFirstSemakan();

// await action.submitKelulusan('Lulus', 'Semua dokumen lengkap dan disokong.');



});