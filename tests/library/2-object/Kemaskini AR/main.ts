import { Locator, Page } from "@playwright/test";

export class KemaskiniARMain {
  constructor(private readonly page: Page) {}

  private selectSearchContainer(fieldName: string): Locator {
    return this.page
      .locator('[data-type="selectSearch"]')
      .filter({ has: this.page.locator(`select[name="${fieldName}"]`) })
      .first();
  }

  get tahapKesihatanContainer(): Locator {
    return this.selectSearchContainer("tahap_kesihatan");
  }

  get keadaanKesihatanSakitContainer(): Locator {
    return this.selectSearchContainer("keadaan_kesihatan_sakit");
  }

  get kosPenjagaanSakitContainer(): Locator {
    return this.selectSearchContainer("kos_penjagaan_sakit");
  }

  get perbelanjaanBulananSakitInput(): Locator {
    return this.page.locator('input[name="perbelanjaan_bulanan_sakit"]');
  }

  get dokumenSokonganKesihatanUpload(): Locator {
    return this.page
      .locator('.formkit-outer[data-type="customFileUpload"]')
      .filter({ hasText: "Upload Dokumen Sokongan Berkaitan Kesihatan" });
  }

  get dokumenSokonganKesihatanPilihFailButton(): Locator {
    return this.dokumenSokonganKesihatanUpload.getByRole("button", {
      name: "Pilih Fail",
      exact: true,
    });
  }
}