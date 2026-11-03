import { test, expect, Page } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { faker } from '@faker-js/faker';
import { LoginAction } from '@library/2-object/Login/action';
import { CarianAsnafAction } from '@library/2-object/Carian Asnaf/action';
import { TIMEOUTS } from '../../library/1-data/config/timeout-config';
import { AduanAction } from '@library/2-object/Pendaftaran Lengkap/action';
import { STATUS_PEKERJAAN } from '@library/2-object/Pendaftaran Lengkap/data';


function generateIC() {
    // Random birth date
    const birthDate = faker.date.birthdate({
        min: 18,
        max: 70,
        mode: 'age',
    });

    // YYMMDD
    const yy = birthDate.getFullYear().toString().slice(-2);
    const mm = String(birthDate.getMonth() + 1).padStart(2, '0');
    const dd = String(birthDate.getDate()).padStart(2, '0');

    // State code (01-14)
    const stateCode = String(faker.number.int({ min: 1, max: 14 })).padStart(2, '0');

    // Last 4 digits
    const randomDigits = String(
        faker.number.int({ min: 0, max: 9999 })
    ).padStart(4, '0');

    return `${yy}${mm}${dd}${stateCode}${randomDigits}`;
}

const firstName = faker.person.firstName();

const data = {
    name: `MAZ ${firstName}`,
    ic: generateIC(),
    email: `maz.${firstName.toLowerCase()}${faker.number.int({ min: 100, max: 999 })}@gmail.com`,
    phone: '0120101001',
    address: 'F-3-4',
};

const TESTING_PDF = path.join(__dirname, '../../library/1-data/files/testing.pdf');


test('E2E-02', async ({ page }) => {
    test.setTimeout(TIMEOUTS.TEN_MINUTES)

    // ------------------------------------------------
    //        EOAD - Login
    // ------------------------------------------------
    const login = new LoginAction(page);

    await login.goto();
    await login.fillIdPengguna('habibullah');
    await login.fillKataLaluan('Password123@');
    await login.clickLogMasuk();
    await page.waitForLoadState('load');

    // ------------------------------------------------
    //        Carian Asnaf
    // ------------------------------------------------
    const carian = new CarianAsnafAction(page);

    await carian.openCarianAsnaf();
    await page.waitForLoadState('load');
    await carian.selectJenisPengenalan('MyKad / MyKid');
    await carian.fillNoPengenalan(data.ic);
    await carian.fillNama(data.name);
    await carian.clickCari();
    await carian.clickIsiBorangPermohonan();
    await carian.clickDaftarTanpaValidasi();

    await page.waitForLoadState('load');

    // ------------------------------------------------
    //        Pendaftaran Lengkap (Aduan form)
    // ------------------------------------------------
    const aduan = new AduanAction(page);

    await aduan.fillNoTelefon(data.phone);
    await aduan.selectStatusPerkahwinan('Bujang');
    await aduan.fillAlamat1('RUMAH');
    await aduan.fillAlamat2('JALAN');
    await aduan.fillPoskod('47500');
    await aduan.selectKariah('MASJID ABU BAKAR AS-SIDDIQ SUBANG JAYA');
    await aduan.selectTahapKeperluan('Kecemasan', 'Tiada bekalan makanan mencukupi');
    await aduan.fillPernyataanMasalah('masalah');
    await aduan.setConsent(true);
    await aduan.clickSimpan();

    await page.waitForLoadState('load');
    await page.waitForTimeout(3000);

    // ------------------------------------------------
    //        Step 2: Maklumat tambahan
    // ------------------------------------------------
    await aduan.uploadDokumenId(TESTING_PDF, 'testing.pdf');
    await aduan.fillEmel(data.email);
    await aduan.selectTempohUnit('Bulan');
    await aduan.fillTempohMenetap('2');
    await aduan.selectStatusKediaman('Milik Sendiri Tidak Berbayar');
    await aduan.selectKeadaanKediaman('Baik/Sempurna');
    await aduan.selectMuallaf('T');
    await aduan.selectMuflis('T');
    await aduan.selectAdaAkaunBank('T');
    /*await aduan.selectNamaBank('MALAYAN BANKING BERHAD');
    await aduan.fillNoAkaunBank('11111111111111111');
    await aduan.uploadPenyataBank(TESTING_PDF, 'testing.pdf');*/
    await aduan.selectTahapKesihatan('Sihat');
    await aduan.clickSeterusnya();

    await page.waitForLoadState('load');
    await page.waitForTimeout(3000);

    await aduan.selectMasihBelajar('02');
    await aduan.selectPendidikanTertinggi('Diploma');
    await aduan.selectAdaKemahiran('T');
    await aduan.clickSeterusnya();

    await page.waitForLoadState('load');
    await page.waitForTimeout(3000);

    await aduan.selectAdaPinjaman('T');
    await aduan.selectAdaAset('T');
    await aduan.clickSeterusnya();

    await page.waitForLoadState('load');
    await page.waitForTimeout(3000);

    await aduan.selectStatusPekerjaan(STATUS_PEKERJAAN.BEKERJA);
    await aduan.selectSektorPekerjaan('Swasta');
    await aduan.fillPendapatanKasar('1500');
    await aduan.uploadPengesahanPendapatan(TESTING_PDF, 'testing.pdf');
    await aduan.clickSelesai();

    await page.waitForTimeout(3000);

    await login.logout();
});