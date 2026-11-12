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

  // whole flow in one call, or call each step individually
  await action.navigateToIndividuForm('HQ ZAKAT SELANGOR');
  await action.lookupByIc('880423108349');

  await page.waitForTimeout(3000);
  // ...fill any remaining fields...
  await action.addToListAndAssignFakir();


  await action.fillMaklumatBantuan(
  'B104 - (HQ) BANTUAN KEPERLUAN HIDUP (FAKIR)',
  '002 - (HQ) KATEGORI MAKAN/MINUM (FAKIR)',
  '20200000027 - (HQ) KATEGORI MAKAN/MINUM (FAKIR)',
  '20200000037 - (HQ) KATEGORI MAKAN/MINUM (FAKIR)',
  '5000'
);

await action.checkApplicantAt(0);

const fixturePath = path.join(__dirname, '../../../tests');
const identityDocumentPath = path.join(fixturePath, 'library/1-data/files/testing.pdf');
const receiptImagePath = path.join(__dirname, 'a1d1557c58e82554ca7226f90e349f39.jpg');

await action.uploadDocument('Dokumen Pengenalan', identityDocumentPath);
await action.uploadDocument(
  /Perbelanjaan makan\/minum/,
  [receiptImagePath, receiptImagePath]
);

// optional remarks
await action.fillDocumentCatatan('Dokumen Pengenalan', 'Salinan MyKad');

await action.clickHantar(1);

await aduan.yaHantar();
await login.logout();

//---------------
// EOAD Sokong
//---------------

await login.goto();
      await login.fillIdPengguna('habibullah');
      await login.fillKataLaluan('Password123@');
      await login.clickLogMasuk();
      await page.waitForLoadState('load');

await action.navigateToSenaraiBulkProcessing();

// Click "Semakan" once. The first click opens the review page.
await action.clickSemakanInRow(0);

await action.completeSemakanFlow('Semua dokumen lengkap dan disahkan.');
await aduan.yaHantar();

await login.logout();


//---------------
// KOAD Lulus
//---------------

await login.goto();
      await login.fillIdPengguna('m.sharil');
      await login.fillKataLaluan('Password123@');
      await login.clickLogMasuk();
      await page.waitForLoadState('load');

await action.navigateToSenaraiBulkProcessing();
await action.clickFirstSemakan();

await action.submitKelulusan('Lulus', 'Semua dokumen lengkap dan disokong.');

});