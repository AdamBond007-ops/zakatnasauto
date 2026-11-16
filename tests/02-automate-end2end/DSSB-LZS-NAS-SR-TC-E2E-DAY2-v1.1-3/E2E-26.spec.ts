import { test, expect, Page } from '@playwright/test';
import path from 'path';
import { faker } from '@faker-js/faker';
import { LoginAction } from '@library/2-object/Login/action';
import { CarianAsnafAction } from '@library/2-object/Carian Asnaf/action';
import { TIMEOUTS } from '../../library/1-data/config/timeout-config';
import { AduanAction } from '@library/2-object/Pendaftaran Lengkap/action';
import { STATUS_PEKERJAAN } from '@library/2-object/Pendaftaran Lengkap/data';
import { KelulusanAction } from '@library/2-object/Kelulusan/action';
import { KemaskiniUAction } from '@library/2-object/Kemaskini U/action';

const TESTING_PDF = path.resolve(__dirname, 'a1d1557c58e82554ca7226f90e349f39.jpg');


test('E2E-02', async ({ page }) => {
    test.setTimeout(TIMEOUTS.TEN_MINUTES)

    const login = new LoginAction(page);
    const carian = new CarianAsnafAction(page);
    const aduan = new AduanAction(page);
    const kemaskiniU = new KemaskiniUAction(page);

    // ------------------------------------------------
    //        Kemaskini Profil Tanpa Kelulusan
    // ------------------------------------------------
    await login.goto();
    await login.fillIdPengguna('781211050343');
    await login.fillKataLaluan('Password123@');
    await login.clickLogMasuk();
    await page.waitForLoadState('load');

    
    
    
    // 1. Click "Profil Saya" link (using its text or data-menu-path attribute)
  
  // Alternative using text: await page.getByRole('link', { name: 'Profil Saya' }).click();


    await page.locator('a[data-menu-path="/profiling/asnaf/profil-saya"]').click();
    await page.locator('button', { hasText: 'Kemaskini' }).click();
    await kemaskiniU.confirmKemaskini();

    await kemaskiniU.selectTahapDaftarKemaskini();
    await kemaskiniU.selectPendaftaranBaharuPerubahanMaklumat();
    await kemaskiniU.fillPernyataanMasalah('masalah');
    await kemaskiniU.uploadAduanLampiran(TESTING_PDF, 'a1d1557c58e82554ca7226f90e349f39.jpg');
    await aduan.clickSeterusnya();
    await page.waitForTimeout(3000);
    await kemaskiniU.fillTempatLahir(faker.lorem.words(2));
    await aduan.clickSimpan();
    await aduan.clickPengesahan();
    await aduan.clickStepPengesahanAkhir();
    
    await aduan.drawSignature();
    // Click "Hantar Permohonan" button
  await page.locator('button', { hasText: 'Hantar Permohonan' }).click();
    await aduan.yaHantar();
    await aduan.clickOk();

});