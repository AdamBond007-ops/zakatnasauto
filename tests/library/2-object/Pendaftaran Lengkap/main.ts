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
        return this.page.getByRole("button", { name: "Simpan" });
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
        return this.selectSearchContainer("tahap_kesihatan");
    }

    /** Ya/Tidak radios: value is "Y" or "T". */
    radioYaTidak(name: string, value: "Y" | "T" | "01" | "02"): Locator {
        return this.page.locator(`input[name="${name}"][value="${value}"]`);
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
        return this.page.getByRole("button", { name: "Seterusnya" });
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
        return this.pengesahanPendapatanUpload.getByRole("button", { name: "Pilih Fail" });
    }
    /** Hidden field: value is "[]" until a file is uploaded. */
    get pengesahanPendapatanValue(): Locator {
        return this.page.locator('input[name="pengesahan_pendapatan"]');
    }

    get selesaiButton(): Locator {
        return this.page.getByRole("button", { name: "Selesai" });
    }
}