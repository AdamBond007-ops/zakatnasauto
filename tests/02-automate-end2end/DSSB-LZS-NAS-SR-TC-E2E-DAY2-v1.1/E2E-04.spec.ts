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
import { KemaskiniUAAction } from '@library/2-object/Kemaskini UA/action';


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
    await aduan.fillPoskod('46200');
    await aduan.selectKariah('MASJID ABU BAKAR AS-SIDDIQ SUBANG JAYA');
    await aduan.selectTahapKeperluan('Kecemasan', 'Tiada bekalan makanan mencukupi');
    await aduan.fillPernyataanMasalah('masalah');
    await aduan.setConsent(true);
    await aduan.clickSimpan();

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

    await aduan.selectMasihBelajar('02');
    await aduan.selectPendidikanTertinggi('Diploma');
    await aduan.selectAdaKemahiran('T');
    await aduan.clickSeterusnya();

    await aduan.selectAdaPinjaman('T');
    await aduan.selectAdaAset('T');
    await aduan.clickSeterusnya();

    await aduan.selectStatusPekerjaan('0');
    // await aduan.selectSektorPekerjaan('Swasta');
    // await aduan.fillPendapatanKasar('300.00');
    // await aduan.uploadPengesahanPendapatan(TESTING_PDF, 'testing.pdf');
    await aduan.clickSelesai();

    await page.waitForTimeout(3000);

    await aduan.clickTanggungan();
    await page.waitForLoadState('load');

    await aduan.clickTambahTanggungan();
    await page.waitForLoadState('load');

    // ------------------------------------------------
    //        Tanggungan
    // ------------------------------------------------
    await aduan.fillNamaTanggungan(`A ${faker.person.firstName().toUpperCase()}`);
    await aduan.selectJenisPengenalanTanggungan('MyKad / MyKid');
    await aduan.fillNoPengenalanTanggungan(generateIC());
    await aduan.selectHubunganTanggungan('Anak Lelaki');
    await aduan.selectJantinaTanggungan('Lelaki');
    await aduan.selectBangsaTanggungan('Melayu');
    await aduan.clickSimpanTanggungan();
    await page.waitForTimeout(3000);
    await aduan.clickEditTanggungan();
    await page.waitForTimeout(1000);

    await aduan.uploadTanggunganDokumenId(TESTING_PDF, 'testing.pdf');
    await aduan.selectTanggunganTempohUnit('Bulan');
    await aduan.fillTanggunganTempohMenetap('5');
    await aduan.selectTanggunganStatusPerkahwinan('Bujang');
    await aduan.selectTanggunganMuallaf('T');
    await aduan.selectTanggunganMuflis('T');
    await aduan.selectTanggunganTahapKesihatan('Sihat');

    await aduan.clickSeterusnya();

    await aduan.selectTanggunganMasihBersekolah('02');
    await aduan.selectTanggunganPendidikanTertinggi('Diploma');

    await aduan.clickSeterusnya();

    await aduan.selectTanggunganAdaPinjaman('T');
    await aduan.selectTanggunganAdaAset('T');

    await aduan.clickSeterusnya();

    await aduan.selectTanggunganStatusPekerjaan(STATUS_PEKERJAAN.TIDAK_BEKERJA);

    await aduan.clickSimpan();

    // ------------------------------------------------
    //        Permohonan Bantuan
    // ------------------------------------------------

    await aduan.clickBantuan();
    await aduan.clickMohonBantuanBaru();

    await aduan.selectAid('(HQ) BANTUAN KEPERLUAN HIDUP (FAKIR)');
    await aduan.selectAidProduct('(HQ) KATEGORI MAKAN/MINUM (FAKIR)');
    await aduan.selectProductPackage('(HQ) KATEGORI MAKAN/MINUM (FAKIR)');
    await aduan.setEntitlementProduct('(HQ) KATEGORI MAKAN/MINUM (FAKIR)');
    await aduan.setCashCounter(true);
    await aduan.fillPenyataanSebab('sda');

    await aduan.clickEditEntitlement('(HQ) KATEGORI MAKAN/MINUM (FAKIR)');
    await aduan.fillKadarBantuan('20.00');
    await aduan.clickSimpanBantuan();

    await aduan.uploadDokumenSokongan(0, TESTING_PDF, 'testing.pdf');
    await aduan.selectStatusDokumenSokongan(0, 'Lengkap');
    await aduan.selectStatusDokumenSokongan(1, 'Tiada Keperluan');
    await aduan.fillCatatanDokumenSokongan(0, 'catatan');

    await aduan.fillNamaDokumenLzs(0, 'Dokumen LZS');
    await aduan.uploadDokumenLzs(0, TESTING_PDF);
    await aduan.fillCatatanDokumenLzs(0, 'catatan lzs');

    await aduan.selectStatusSiasatan('Sokong');
    await aduan.fillCatatanSiasatan('dsa');

    await aduan.expectStatusDokumenSokongan('LENGKAP');
    await aduan.clickSimpan();
    await aduan.clickYaSimpan();
    await aduan.clickOk();

    await aduan.clickBantuan();
    await aduan.selectKaedahSiasatan('Lapangan');
    //await aduan.fillTarikhSiasatan('2026-11-05');   // optional, already today
    await aduan.fillMasaSiasatan('10:30');
    //await aduan.uploadGambarSiasatan(TESTING_IMG);
    await aduan.fillLaporanSiasatan('Siasatan lapangan telah dijalankan');
    await aduan.selectPengesahanLawatan('tandatangan');
    await aduan.lukisTandatangan();
    await aduan.clickSahkanLawatan();

    await aduan.clickPengesahan();
    await aduan.clickStepPengesahanAkhir();
    await aduan.selectHubunganKakitanganLzs('T');
    await aduan.selectHubunganPenolongAmil('T');
    await aduan.lukisTandatanganPengesahanAkhir();
    await aduan.expectTarikhPerakuan();
    await aduan.fillCatatanSokongan('Catatan sokongan');
    await aduan.clickHantar();
    await aduan.yaHantar();
    await aduan.clickOk();
    await aduan.clickTeruskanChoice('Tidak');
    await page.waitForTimeout(3000);
    await login.logout();

    // ------------------------------------------------
    //        KOAD LOGIN
    // ------------------------------------------------
    await login.goto();
    await login.fillIdPengguna('m.sharil');
    await login.fillKataLaluan('Password123@');
    await login.clickLogMasuk();
    await page.waitForLoadState('load');
    const kelulusan = new KelulusanAction(page);
    await kelulusan.goToKelulusan();
    await kelulusan.cariByIc(data.ic);
    await kelulusan.clickLihatKelulusan(data.ic);
    await kelulusan.clickDetailTab('Bantuan');
    await kelulusan.clickLihatTindakanBantuanByNama(data.name);
    await kelulusan.selectStatusKelulusan('Lulus');
    await kelulusan.fillCatatanBantuan('Permohonan diluluskan.');
    await aduan.clickSimpan();
    await kelulusan.openKeputusanKelulusan();
    await kelulusan.selectKeputusan('Lulus');
    await kelulusan.fillCatatanKelulusan('lulus');
    await aduan.clickHantar();
    await aduan.yaHantar();
    await page.waitForTimeout(3000);
    await aduan.clickOk();
    await login.logout();

    // ------------------------------------------------
    //        Kemaskini Profil With Approval
    // ------------------------------------------------
    await login.goto();
    await login.fillIdPengguna('habibullah');
    await login.fillKataLaluan('Password123@');
    await login.clickLogMasuk();
    await page.waitForLoadState('load');

    const kemaskiniU = new KemaskiniUAction(page);
    
    await carian.openCarianAsnaf();
    await page.waitForLoadState('load');
    await carian.selectJenisPengenalan('MyKad / MyKid');
    await carian.fillNoPengenalan(data.ic);
    await carian.fillNama(data.name);
    await carian.clickCari();

    await kemaskiniU.clickLihatProfil(data.ic);
    await kemaskiniU.clickKemaskini();
    await kemaskiniU.confirmKemaskini();

    await kemaskiniU.selectTahapDaftarKemaskini();
    await kemaskiniU.selectPendaftaranBaharuPerubahanMaklumat();
    await kemaskiniU.fillPernyataanMasalah('masalah');
    await kemaskiniU.uploadAduanLampiran(TESTING_PDF, 'testing.pdf');
    await aduan.clickSeterusnya();
    await page.waitForTimeout(3000);
    const kemaskiniUA = new KemaskiniUAAction(page);
    await kemaskiniUA.selectMuflisYa();
    await kemaskiniUA.fillSebabMuflis(faker.lorem.words(3));
    await kemaskiniUA.uploadDokumenMuflis(TESTING_PDF, 'testing.pdf');

    await aduan.clickSimpan();
    await aduan.clickPengesahan();
    await kemaskiniUA.uploadDokumenBermastautin(TESTING_PDF, 'testing.pdf');
    await aduan.clickStepPengesahanAkhir();
    
    await kemaskiniU.selectTiadaTandatanganDigital();
    await kemaskiniU.fillCatatan('Kemaskini profil dengan kelulusan.');
    await aduan.clickHantar();
    await aduan.yaHantar();
    await aduan.clickOk();
    await login.logout();


    // ------------------------------------------------
    //        Kemaskini Profil With Approval
    // ------------------------------------------------

     await login.goto();
        await login.fillIdPengguna('ZAKATSELarif');
        await login.fillKataLaluan('Password123@');
        await login.clickLogMasuk();
        await page.waitForLoadState('load');
        
        await kelulusan.goToKelulusan();
        await kelulusan.cariByIc(data.ic);
        await kelulusan.clickLihatKelulusan(data.ic);
        
        await page.waitForTimeout(3000);
        await kelulusan.selectKeputusan('Lulus');
        await kelulusan.fillCatatanKelulusan('lulus');
        await aduan.clickHantar();
        await aduan.yaHantar();
        await page.waitForTimeout(3000);
        await aduan.clickOk();
        await login.logout();
});