import { test, expect, Page } from '@playwright/test';
import path from 'path';
import { faker } from '@faker-js/faker';
import { LoginAction } from '@library/2-object/Login/action';
import { CarianAsnafAction } from '@library/2-object/Carian Asnaf/action';
import { TIMEOUTS } from '../../library/1-data/config/timeout-config';
import { AduanAction } from '@library/2-object/Pendaftaran Lengkap/action';
import { STATUS_PEKERJAAN } from '@library/2-object/Pendaftaran Lengkap/data';
import { KelulusanAction } from '@library/2-object/Kelulusan/action';
import { ElaunTahunanActions } from '@library/2-object/Elaun/action';
import { ElaunTahunanLocators } from '@library/2-object/Elaun/main';


const TESTING_PDF = path.join(__dirname, '../../library/1-data/files/testing.pdf');
const TESTING_IMAGE = path.join(__dirname, 'a1d1557c58e82554ca7226f90e349f39.jpg');


test('E2E-02', async ({ page }) => {
    test.setTimeout(TIMEOUTS.TEN_MINUTES)

    // ------------------------------------------------
    //        Eksekutif - Login
    // ------------------------------------------------
    const login = new LoginAction(page);
    const elaun = new ElaunTahunanActions(new ElaunTahunanLocators(page));

    await login.goto();
    await login.fillIdPengguna('usamah.mt');
    await login.fillKataLaluan('Password123@');
    await login.clickLogMasuk();
    await page.waitForLoadState('load');

   await elaun.switchRoleToEksekutifPA();
   await elaun.navigateToElaunTahunan();

   await elaun.searchFiltersByLabel({
    tahun: "2026",
    daerah: "PETALING",
    kariah: "MASJID ABU BAKAR AS-SIDDIQ SUBANG JAYA",
    kategori: "Kariah (PAK)",
    jawatan: "Penolong Amil Kariah",
    elaun: "Anugerah KPAK Terbaik"
  });

  await elaun.selectRecordAndConfirm();
  await elaun.submitElaunForm("Permohonan elaun tahunan lengkap.", TESTING_IMAGE);

  await login.logout();

    // ------------------------------------------------
    //        KJ - Login
    // ------------------------------------------------

    await login.goto();
    await login.fillIdPengguna('salahuddin');
    await login.fillKataLaluan('Password123@');
    await login.clickLogMasuk();
    await page.waitForLoadState('load');

    await elaun.switchRoleToKJPPA();
    await elaun.navigateToElaunTahunanKJ();
    // Execute the bulk approval step:
    await elaun.processBulkApproval("Kelulusan permohonan elaun tahunan", "Lulus");

});