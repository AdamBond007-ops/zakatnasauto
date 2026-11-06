import { Locator, Page } from "@playwright/test";

export class PAKDaftarMain {
  constructor(private readonly page: Page) {}

  private selectSearchContainer(fieldName: string): Locator {
    return this.page
      .locator('[data-type="selectSearch"]')
      .filter({ has: this.page.locator(`select[name="${fieldName}"]`) });
  }

  get emelInput(): Locator {
    return this.page.locator('input[name="aduan_individu.email"]');
  }

  get noTelefonInput(): Locator {
    return this.page.locator('input[name="aduan_individu.no_telefon"]');
  }

  get statusPerkahwinanContainer(): Locator {
    return this.selectSearchContainer("aduan_individu.status_perkahwinan");
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

  get negeriContainer(): Locator {
    return this.selectSearchContainer("aduan_individu.negeri");
  }

  get daerahContainer(): Locator {
    return this.selectSearchContainer("aduan_individu.daerah");
  }

  get bandarInput(): Locator {
    return this.page.locator('input[name="aduan_individu.bandar"]');
  }

  get kariahContainer(): Locator {
    return this.selectSearchContainer("aduan_individu.kariah");
  }

  selectSearchOption(optionText: string): Locator {
    return this.page
      .getByRole("option", { name: optionText, exact: true })
      .or(this.page.getByRole("listbox").getByText(optionText, { exact: true }));
  }

  tahapRadio(name: string): Locator {
    return this.page.getByRole("radio", { name, exact: false });
  }

  tahapSubRadio(name: string): Locator {
    return this.page.getByRole("radio", { name, exact: true });
  }

  get pernyataanMasalahInput(): Locator {
    return this.page.locator('textarea[name="masalah.pernyataan_masalah"]');
  }

  get lampiranUpload(): Locator {
    return this.page
      .locator(".custom-file-upload")
      .filter({ has: this.page.locator('input[name="masalah.lampiran_files"]') });
  }

  get lampiranPilihFailButton(): Locator {
    return this.lampiranUpload.getByRole("button", { name: "Pilih Fail", exact: true });
  }

  get lampiranValue(): Locator {
    return this.lampiranUpload.locator('input[name="masalah.lampiran_files"]');
  }

  get consentCheckbox(): Locator {
    return this.page.locator('input[type="checkbox"][name="consent"]');
  }

  get tempatLahirInput(): Locator {
    return this.page.locator('input[name="tempat_lahir"]');
  }

  get tempohUnitContainer(): Locator {
    return this.selectSearchContainer("tempoh_menetap_selangor_unit");
  }

  get tempohMenetapInput(): Locator {
    return this.page.locator('input[name="tempoh_menetap_selangor_nilai"]');
  }
}