import { Locator, Page } from "@playwright/test";

export class AduanMain {
  constructor(private readonly page: Page) {}

  get daftarSebagaiPengaduWakilButton(): Locator {
    return this.page.getByRole("button", {
      name: "Daftar sebagai Pengadu (Wakil)",
      exact: true,
    });
  }

  get pengaduNamaPenuhInput(): Locator {
    return this.page.locator('input[name="pengadu.nama_penuh"]');
  }

  get pengaduNoPengenalanInput(): Locator {
    return this.page.locator('input[name="pengadu.id_pengenalan"]');
  }

  get pengaduEmelInput(): Locator {
    return this.page.locator('input[name="pengadu.email"]');
  }

  get pengaduNoTelefonInput(): Locator {
    return this.page.locator('input[name="pengadu.no_telefon"]');
  }

  get aduanIndividuNamaPenuhInput(): Locator {
    return this.page.locator('input[name="aduan_individu.nama_penuh"]');
  }

  get aduanIndividuNoPengenalanInput(): Locator {
    return this.page.locator('input[name="aduan_individu.id_pengenalan"]');
  }

  get aduanIndividuEmelInput(): Locator {
    return this.page.locator('input[name="aduan_individu.email"]');
  }

  get aduanIndividuNoTelefonInput(): Locator {
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

  get negeriSelect(): Locator {
    return this.page.locator('select[name="aduan_individu.negeri"]');
  }

  get daerahSelect(): Locator {
    return this.page.locator('select[name="aduan_individu.daerah"]');
  }

  get bandarInput(): Locator {
    return this.page.locator('input[name="aduan_individu.bandar"]');
  }

  selectSearchContainer(selectName: string): Locator {
    return this.page
      .locator('[data-type="selectSearch"]')
      .filter({ has: this.page.locator(`select[name="${selectName}"]`) });
  }

  tahapKeperluanRadio(name: string): Locator {
    return this.page.getByRole("radio", { name, exact: true });
  }

  tahapKeperluanSubRadio(name: string): Locator {
    return this.page.getByRole("radio", { name, exact: true });
  }

  get pernyataanMasalahInput(): Locator {
    return this.page.locator('textarea[name="masalah.pernyataan_masalah"]');
  }

  get lampiranFileInput(): Locator {
    return this.page
      .locator(".custom-file-upload")
      .filter({ has: this.page.locator('input[name="masalah.lampiran_files"]') })
      .locator('input[type="file"][accept="image/*,application/pdf"]');
  }

  get lampiranValue(): Locator {
    return this.page.locator('input[name="masalah.lampiran_files"]');
  }

  get consentCheckbox(): Locator {
    return this.page.locator('input[type="checkbox"][name="consent"]');
  }

  get hantarButton(): Locator {
    return this.page.getByRole("button", { name: "Hantar", exact: true });
  }
}
