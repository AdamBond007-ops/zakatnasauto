import { Locator, Page } from "@playwright/test";

export class KemaskiniUAMain {
  constructor(private readonly page: Page) {}

  get muflisYaRadio(): Locator {
    return this.page.locator('input[type="radio"][name="muflis_disenarai_hitam"][value="Y"]');
  }

  get sebabMuflisInput(): Locator {
    return this.page.locator('textarea[name="sebab_senarai_hitam"]');
  }

  get dokumenMuflisUpload(): Locator {
    return this.page
      .locator(".custom-file-upload")
      .filter({ has: this.page.locator('input[name="dokumen_muflis"]') });
  }

  get dokumenMuflisPilihFailButton(): Locator {
    return this.dokumenMuflisUpload.getByRole("button", { name: "Pilih Fail", exact: true });
  }

  get dokumenMuflisValue(): Locator {
    return this.dokumenMuflisUpload.locator('input[name="dokumen_muflis"]');
  }

  get dokumenBermastautinUpload(): Locator {
    return this.page
      .locator(".custom-file-upload")
      .filter({ has: this.page.locator('input[name="surat_pengesahan_bermastautin"]') });
  }

  get dokumenBermastautinPilihFailButton(): Locator {
    return this.dokumenBermastautinUpload.getByRole("button", { name: "Pilih Fail", exact: true });
  }

  get dokumenBermastautinValue(): Locator {
    return this.dokumenBermastautinUpload.locator('input[name="surat_pengesahan_bermastautin"]');
  }
}