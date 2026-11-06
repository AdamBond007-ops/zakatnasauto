import { Locator, Page } from "@playwright/test";
import { LABELS } from "@library/2-object/Pendaftaran Lengkap/data";

/** Locators / getters only. No clicks, fills or assertions here. */
export class PendaftaranLengkapMain {
    constructor(private readonly page: Page) { }

    get form(): Locator {
        return this.page.locator("#aduan-tab-content-form");
    }

    // --- Text inputs ---
    get noTelefonInput(): Locator {
        return this.page.locator('input[name="aduan_individu.no_telefon"]');
    }
    get alamat1Input(): Locator {
        return this.page.locator('input[name="aduan_individu.alamat_1"]');
    }
    get alamat2Input(): Locator {
        return this.page.locator('input[name="aduan_individu.alamat_2"]');
    }
    get alamat3Input(): Locator {
        return this.page.locator('input[name="aduan_individu.alamat_3"]');
    }
    get poskodInput(): Locator {
        return this.page.locator('input[name="aduan_individu.poskod"]');
    }
    get bandarInput(): Locator {
        return this.page.locator('input[name="aduan_individu.bandar"]');
    }
    get pernyataanMasalahInput(): Locator {
        return this.page.locator('textarea[name="masalah.pernyataan_masalah"]');
    }

    // --- Dropdowns (FormKit selectSearch), found by the name of the hidden <select> ---
    get statusPerkahwinanContainer(): Locator {
        return this.selectSearchContainer("aduan_individu.status_perkahwinan");
    }
    get negeriContainer(): Locator {
        return this.selectSearchContainer("aduan_individu.negeri");
    }
    get daerahContainer(): Locator {
        return this.selectSearchContainer("aduan_individu.daerah");
    }
    get kariahContainer(): Locator {
        return this.selectSearchContainer("aduan_individu.kariah");
    }

    private selectSearchContainer(selectName: string): Locator {
        return this.page
            .locator('[data-type="selectSearch"]')
            .filter({ has: this.page.locator(`select[name="${selectName}"]`) });
    }

    /** Option in the opened list (list may render outside the container, so page level). */
    selectSearchOption(optionText: string): Locator {
        return this.page
            .getByRole("option", { name: optionText, exact: true })
            .or(this.page.getByRole("listbox").getByText(optionText, { exact: true }));
    }

    // --- Map (Leaflet) ---
    get map(): Locator {
        return this.form.locator(".leaflet-container");
    }

    // --- Tahap Keperluan Bantuan ---
    tahapRadio(name: string): Locator {
        return this.page.getByRole("radio", { name, exact: false });
    }
    /** Sub radios have the same role, only visible once parent is chosen. */
    tahapSubRadio(name: string): Locator {
        return this.page.getByRole("radio", { name, exact: true });
    }

    // --- Consent + submit ---
    get consentCheckbox(): Locator {
        return this.page.getByRole("checkbox", { name: LABELS.consent });
    }
    get simpanButton(): Locator {
        return this.page.getByRole("button", { name: "Simpan", exact: true }).first();
    }

    // --- Step 2: Maklumat tambahan ---

    get dokumenIdUpload(): Locator {
        return this.page
            .locator(".custom-file-upload")
            .filter({ has: this.page.locator('input[name="dokumen_id"]') });
    }
    get dokumenIdFileInput(): Locator {
        return this.dokumenIdUpload.locator('input[type="file"]').first();
    }

    get dokumenIdPilihFailButton(): Locator {
        return this.dokumenIdUpload.getByRole("button", { name: "Pilih Fail" });
    }
    /** Hidden field: value is "[]" until a file is uploaded. */
    get dokumenIdValue(): Locator {
        return this.page.locator('input[name="dokumen_id"]');
    }

    get emelInput(): Locator {
        return this.page.getByRole("textbox", { name: "Emel*" });
    }
    get tempohNilaiInput(): Locator {
        return this.page.locator('input[name="tempoh_menetap_selangor_nilai"]');
    }

    // selectSearch dropdowns (found by the name of the hidden <select>)
    get tempohUnitContainer(): Locator {
        return this.selectSearchContainer("tempoh_menetap_selangor_unit");
    }
    get statusKediamanContainer(): Locator {
        return this.selectSearchContainer("status_kediaman");
    }
    get keadaanKediamanContainer(): Locator {
        return this.selectSearchContainer("keadaan_kediaman");
    }
    get namaBankContainer(): Locator {
        return this.selectSearchContainer("bank0NamaBank");
    }
    get tahapKesihatanContainer(): Locator {
        return this.selectSearchContainer("tahap_kesihatan").first();
    }
    get tanggunganTahapKesihatanContainer(): Locator {
        return this.page
            .locator('[data-type="selectSearch"]')
            .filter({ has: this.page.locator('select[name="tahap_kesihatan"]') })
            .filter({ hasText: "Pilih status kesihatan tanggungan" });
    }

    /** Ya/Tidak radios: value is "Y" or "T". */
    radioYaTidak(name: string, value: "Y" | "T" | "01" | "02"): Locator {
        return this.page.locator(`input[name="${name}"][value="${value}"]`).last();
    }

    // Bank account
    get noAkaunBankInput(): Locator {
        return this.page.locator('input[name="bank0NoAkaun"]');
    }
    get semakAkaunButton(): Locator {
        return this.page.getByRole("button", { name: "Semak" });
    }

    // Upload penyata bank: the file input sits in the same wrapper as the hidden field
    get penyataBankUpload(): Locator {
        return this.page
            .locator(".custom-file-upload")
            .filter({ has: this.page.locator('input[name="dokumen_penyata_bank"]') });
    }
    get penyataBankFileInput(): Locator {
        return this.penyataBankUpload.locator('input[type="file"]').first();
    }

    get seterusnyaButton(): Locator {
        return this.page.getByRole("button", { name: "Seterusnya", exact: true });
    }

    get pendidikanTertinggiContainer(): Locator {
        return this.selectSearchContainer("pendidikan_tertinggi");
    }

    /** value: "1" = Bekerja, "0" = Tidak Bekerja */
    statusPekerjaanRadio(value: string): Locator {
        return this.page.locator(`input[name="status_pekerjaan"][value="${value}"]`);
    }

    get sektorPekerjaanContainer(): Locator {
        return this.selectSearchContainer("sektor_pekerjaan");
    }

    get pendapatanKasarInput(): Locator {
        return this.page.getByRole("textbox", { name: "Pendapatan Kasar (RM)*" });
    }

    get pengesahanPendapatanUpload(): Locator {
        return this.page
            .locator(".custom-file-upload")
            .filter({ has: this.page.locator('input[name="pengesahan_pendapatan"]') });
    }
    get pengesahanPendapatanFileInput(): Locator {
        return this.penyataBankUpload.locator('input[type="file"]').first();
    }

    get pengesahanPendapatanPilihFailButton(): Locator {
        return this.pengesahanPendapatanUpload.getByRole("button", { name: "Pilih Fail", exact: true });
    }
    /** Hidden field: value is "[]" until a file is uploaded. */
    get pengesahanPendapatanValue(): Locator {
        return this.page.locator('input[name="pengesahan_pendapatan"]');
    }

    get selesaiButton(): Locator {
        return this.page.getByRole("button", { name: "Selesai", exact: true });
    }

    get tanggunganButton(): Locator {
        return this.page.getByRole("button", { name: "Tanggungan", exact: true });
    }

    get tambahTanggunganButton(): Locator {
        return this.page.getByRole("button", { name: "Tambah Tanggungan", exact: true });
    }

    get namaTanggunganInput(): Locator {
        return this.page.getByRole("textbox", { name: "Nama Tanggungan*" });
    }

    // --- Tanggungan form (found by data-field, names are auto-generated) ---
    get tanggunganForm(): Locator {
        return this.page
            .locator("form")
            .filter({ has: this.page.locator('select[data-field="kod_hubungan"]') });
    }

    private tanggunganSelectSearch(dataField: string): Locator {
        return this.tanggunganForm
            .locator('[data-type="selectSearch"]')
            .filter({ has: this.page.locator(`select[data-field="${dataField}"]`) });
    }

    get tanggunganNamaInput(): Locator {
        return this.tanggunganForm.locator('input[data-field="nama"]');
    }
    get tanggunganJenisPengenalanContainer(): Locator {
        return this.tanggunganSelectSearch("kod_jenis_pengenalan");
    }
    get tanggunganNoPengenalanInput(): Locator {
        return this.tanggunganForm.locator('input[data-field="no_pengenalan"]');
    }
    get tanggunganTarikhLahirInput(): Locator {
        return this.tanggunganForm.locator('input[data-field="tarikh_lahir"]');
    }
    get tanggunganHubunganContainer(): Locator {
        return this.tanggunganSelectSearch("kod_hubungan");
    }
    get tanggunganJantinaContainer(): Locator {
        return this.tanggunganSelectSearch("kod_jantina");
    }
    get tanggunganBangsaContainer(): Locator {
        return this.tanggunganSelectSearch("kod_bangsa");
    }
    get tanggunganSimpanButton(): Locator {
        return this.tanggunganForm.getByRole("button", { name: "Simpan", exact: true });
    }
    get tanggunganBatalButton(): Locator {
        return this.tanggunganForm.getByRole("button", { name: "Batal", exact: true });
    }
    /** Pencil icon, one per tanggungan row. */
    get editTanggunganButtons(): Locator {
        return this.page.getByTitle("Edit maklumat tanggungan");
    }
    get tanggunganDokumenIdUpload(): Locator {
        return this.page
            .locator(".custom-file-upload")
            .filter({ has: this.page.locator('input[name="dokumen_nombor_id"]') });
    }
    get tanggunganDokumenIdFileInput(): Locator {
        return this.tanggunganDokumenIdUpload.locator('input[type="file"]').first();
    }

    get tanggunganDokumenIdPilihFailButton(): Locator {
        return this.tanggunganDokumenIdUpload.getByRole("button", { name: "Pilih Fail" });
    }
    /** Hidden field: value is "[]" until a file is uploaded. */
    get tanggunganDokumenIdValue(): Locator {
        return this.page.locator('input[name="dokumen_nombor_id"]');
    }
    get tanggunganStatusPerkahwinanContainer(): Locator {
        return this.selectSearchContainer("status_perkahwinan_tanggungan");
    }
    get tanggunganTempohUnitContainer(): Locator {
        return this.selectSearchContainer("tempoh_menetap_selangor_tanggungan_unit");
    }
    get tanggunganTempohNilaiInput(): Locator {
        return this.page.locator('input[name="tempoh_menetap_selangor_tanggungan_nilai"]');
    }
    get tanggunganPendidikanTertinggiContainer(): Locator {
        return this.selectSearchContainer("pendidikan_tertinggi_tanggungan");
    }
    /** value: "1" = Bekerja, "0" = Tidak Bekerja */
    tanggunganStatusPekerjaanRadio(value: string): Locator {
        return this.page.locator(`input[name="pekerjaan_status_tanggungan"][value="${value}"]`);
    }

    get bantuanButton(): Locator {
        return this.page.getByRole("button", { name: "Bantuan", exact: true });
    }
    get mohonBantuanBaruButton(): Locator {
        return this.page.getByRole("button", { name: "Mohon Bantuan Baru", exact: true });
    }

    get formB(): Locator {
        return this.page.locator("#permohonan-bantuan-form");
    }

    /** Card found by its heading text (exact, so "Dokumen Sokongan" != "Dokumen Sokongan Dari LZS"). */
    card(heading: string): Locator {
        return this.formB.locator(".card").filter({
            has: this.page.getByRole("heading", { name: heading, exact: true }),
        });
    }

    /** FormKit selectSearch found by its label, e.g. /^Aid\*$/ */
    private selectSearchByLabel(label: RegExp): Locator {
        return this.formB
            .locator('[data-type="selectSearch"]')
            .filter({ has: this.page.locator("label", { hasText: label }) });
    }

    // --- Maklumat Permohonan Bantuan ---
    get aidContainer(): Locator {
        return this.selectSearchByLabel(/^Aid\*$/);
    }
    get aidProductContainer(): Locator {
        return this.selectSearchByLabel(/^Aid Product\*$/);
    }
    get productPackageContainer(): Locator {
        return this.selectSearchByLabel(/^Product Package\*$/);
    }
    /** Visible label that the app listens to (the real input is sr-only). */
    entitlementLabel(name: string): Locator {
        return this.formB.locator('label[for^="entitlement-"]').filter({ hasText: name });
    }
    entitlementCheckbox(name: string): Locator {
        return this.formB.getByRole("checkbox", { name });
    }
    get cashCounterToggle(): Locator {
        return this.formB.getByRole("checkbox", { name: "Cash Counter/Lapangan" });
    }
    /** Visible switch (label wraps the input, the slider and the text). */
    get cashCounterLabel(): Locator {
        return this.formB.locator("label").filter({ hasText: "Cash Counter/Lapangan" });
    }
    get penyataanSebabInput(): Locator {
        return this.formB.getByRole("textbox", { name: "Penyataan Sebab Permohonan Bantuan" });
    }

    // --- Maklumat Penerima Manfaat ---
    get namaPenerimaContainer(): Locator {
        return this.selectSearchByLabel(/^Nama\*$/);
    }

    // --- Senarai Entitlement Product (one card per product) ---
    entitlementCard(name: string): Locator {
        return this.formB.locator("div.rounded-lg.p-4").filter({
            has: this.page.getByRole("heading", { name, level: 3 }),
        });
    }
    entitlementEditButton(name: string): Locator {
        return this.entitlementCard(name).getByRole("button", { name: "Edit", exact: true });
    }

    // --- Dokumen Sokongan (rows by index) ---
    get dokumenSokonganCard(): Locator {
        return this.card("Dokumen Sokongan");
    }
    get dokumenSokonganUploadButtons(): Locator {
        return this.dokumenSokonganCard.locator('button:has(span[class*="i-mdi:upload"])');
    }
    dokumenSokonganStatusContainer(index: number): Locator {
        return this.dokumenSokonganCard.locator('[data-type="selectSearch"]').nth(index);
    }
    dokumenSokonganCatatan(index: number): Locator {
        return this.dokumenSokonganCard.locator("textarea").nth(index);
    }

    // --- Dokumen Sokongan Dari LZS (rows by index) ---
    get dokumenLzsCard(): Locator {
        return this.card("Dokumen Sokongan Dari LZS");
    }
    dokumenLzsNamaInput(index: number): Locator {
        return this.dokumenLzsCard.getByPlaceholder("Nama/rujukan dokumen").nth(index);
    }
    get dokumenLzsUploadButtons(): Locator {
        return this.dokumenLzsCard.locator('button:has(span[class*="i-mdi:upload"])');
    }
    dokumenLzsCatatan(index: number): Locator {
        return this.dokumenLzsCard.locator("textarea").nth(index);
    }
    get tambahDokumenLzsButton(): Locator {
        return this.dokumenLzsCard.getByRole("button", { name: "Tambah", exact: true });
    }

    // --- Keputusan Siasatan ---
    get statusSiasatanContainer(): Locator {
        return this.selectSearchByLabel(/^Status Siasatan\*$/);
    }
    get catatanSiasatanInput(): Locator {
        return this.card("Keputusan Siasatan").getByRole("textbox", { name: "Catatan" });
    }

    // --- Senarai Bantuan ---
    get tabLzs(): Locator {
        return this.card("Senarai Bantuan").getByRole("button", { name: "LZS", exact: true });
    }
    get tabAgensi(): Locator {
        return this.card("Senarai Bantuan").getByRole("button", { name: "Agensi", exact: true });
    }
    get tahunContainer(): Locator {
        return this.selectSearchByLabel(/^Tahun$/);
    }
    get dapatkanDataButton(): Locator {
        return this.page.getByRole("button", { name: "Dapatkan Data" });
    }

    // --- Tindakan ---
    get statusDokumenSokonganBadge(): Locator {
        return this.card("Tindakan").locator("span.rounded-full");
    }
    get modalFooter(): Locator {
        return this.page.locator(".modal-footer");
    }
    get simpanBantuanButton(): Locator {
        return this.modalFooter.getByRole("button", { name: "Simpan", exact: true });
    }
    get simpanBatalButton(): Locator {
        return this.modalFooter.getByRole("button", { name: "Batal", exact: true });
    }
    get kembaliButton(): Locator {
        return this.page.getByRole("button", { name: "Kembali" });
    }
    // --- Kadar Bantuan (RM) ---
    get kadarBantuanInput(): Locator {
        return this.page.getByRole("textbox", { name: "Kadar Bantuan (RM)" });
    }

    // --- SweetAlert2 popup buttons ---
    get swalPopup(): Locator {
        return this.page.locator(".swal2-popup");
    }
    get swalYaSimpanButton(): Locator {
        return this.swalPopup.getByRole("button", { name: "Ya, Simpan", exact: true });
    }
    get swalYaHantarButton(): Locator {
        return this.swalPopup.getByRole("button", { name: "Ya, Hantar", exact: true });
    }
    get swalOkButton(): Locator {
        return this.swalPopup.getByRole("button", { name: "OK", exact: true });
    }
    teruskanChoiceButton(choice: "Ya, Teruskan" | "Tidak"): Locator {
        return this.page.getByRole("button", { name: choice, exact: true });
    }

    // ------------------------------------------------
    //        Kaedah Siasatan
    // ------------------------------------------------

    // --- Kaedah Siasatan ---
    get kaedahSiasatanCard(): Locator {
        return this.page.locator("#kaedah-siasatan-form");
    }
    get kaedahSiasatanContainer(): Locator {
        return this.kaedahSiasatanCard
            .locator('[data-type="selectSearch"]')
            .filter({ has: this.page.locator("label", { hasText: /^Kaedah Siasatan\*$/ }) });
    }
    get laporanSiasatanInput(): Locator {
        return this.kaedahSiasatanCard.getByRole("textbox", { name: "Laporan Siasatan" });
    }
    get tarikhSiasatanInput(): Locator {
        return this.kaedahSiasatanCard.getByLabel("Tarikh Siasatan");
    }
    get masaSiasatanInput(): Locator {
        return this.kaedahSiasatanCard.getByLabel("Masa Siasatan");
    }

    // Gambar Lokasi / Bukti Visual (image only, max 5 MB)
    get gambarSiasatanPilihFailButton(): Locator {
        return this.kaedahSiasatanCard.getByRole("button", { name: "Pilih Fail" });
    }
    /** Hidden field: value is "[]" until an image is uploaded. */
    get gambarSiasatanValue(): Locator {
        return this.kaedahSiasatanCard.locator('input[name="gambar_siasatan"]');
    }

    // Pengesahan Lawatan: radios have no name attribute, so use the label text
    get pengesahanTandatanganRadio(): Locator {
        return this.kaedahSiasatanCard.getByRole("radio", { name: "Tandatangan Digital" });
    }
    get pengesahanQrRadio(): Locator {
        return this.kaedahSiasatanCard.getByRole("radio", { name: "QR Code" });
    }

    // --- Pengesahan Lawatan: Tandatangan Digital modal ---
    get tandatanganModal(): Locator {
        return this.page
            .locator(".modal-body")
            .filter({ hasText: "Sila turunkan tandatangan digital" });
    }
    get tandatanganCanvas(): Locator {
        return this.tandatanganModal.locator("canvas");
    }
    get padamTandatanganButton(): Locator {
        return this.tandatanganModal.getByRole("button", { name: "Padam Tandatangan", exact: true });
    }
    get sahkanLawatanButton(): Locator {
        return this.tandatanganModal.getByRole("button", { name: "Sahkan Lawatan" });
    }
    get tandatanganBatalButton(): Locator {
        return this.tandatanganModal.getByRole("button", { name: "Batal", exact: true });
    }

    // ------------------------------------------------
    //        Pengesahan
    // ------------------------------------------------

    get pengesahanButton(): Locator {
        return this.page.getByRole("button", { name: "Pengesahan", exact: true });
    }

    // --- Pengesahan Akhir ---
    get stepPengesahanAkhir(): Locator {
        // Stepper button name also contains status text ("Belum Selesai 50%"), so match the start
        return this.page.getByRole("button", { name: /^Pengesahan Akhir/ });
    }
    get pengesahanAkhirForm(): Locator {
        return this.page.locator("#pengesahanAkhirForm");
    }
    hubunganKakitanganLzsRadio(value: "Y" | "T"): Locator {
        return this.pengesahanAkhirForm.locator(`input[name="hubungan_kakitangan_lzs"][value="${value}"]`);
    }
    hubunganPenolongAmilRadio(value: "Y" | "T"): Locator {
        return this.pengesahanAkhirForm.locator(`input[name="hubungan_penolong_amil"][value="${value}"]`);
    }
    /** Icon-only button under the consent text (opens the account details). */
    get butiranAkaunButton(): Locator {
        return this.pengesahanAkhirForm.locator('button:has(span[class*="i-mdi:account-details"])');
    }
    get pengesahanAkhirCanvas(): Locator {
        return this.pengesahanAkhirForm.locator("canvas");
    }
    get pengesahanAkhirPadamButton(): Locator {
        return this.pengesahanAkhirForm.getByRole("button", { name: "Padam Tandatangan", exact: true });
    }
    get tarikhPerakuanInput(): Locator {
        return this.pengesahanAkhirForm.locator('input[name="tarikh_perakuan"]');
    }
    get catatanSokonganInput(): Locator {
        return this.page.getByPlaceholder("Masukkan catatan sokongan...");
    }
    get hantarButton(): Locator {
        return this.page.getByRole("button", { name: "Hantar", exact: true });
    }
}