import { Locator, Page } from "@playwright/test";

export class CarianAsnafMain {
  constructor(private readonly page: Page) {}

  get menuCarianAsnaf(): Locator {
    return this.page.locator("a").filter({ hasText: "Carian Asnaf" });
  }

  // Jenis Pengenalan dropdown (still showing the "Sila Pilih" placeholder)
  get jenisPengenalanTrigger(): Locator {
    return this.page.locator("div").filter({ hasText: /^Sila Pilih$/ });
  }
  jenisPengenalanOption(name: string): Locator {
    return this.page.getByRole("option", { name });
  }

  get noPengenalanInput(): Locator {
    return this.page.getByRole("textbox", { name: "No. Pengenalan" });
  }
  get namaInput(): Locator {
    return this.page.getByRole("textbox", { name: "Nama" });
  }
  get cariButton(): Locator {
    return this.page.getByRole("button", { name: "Cari" });
  }
  get isiBorangButton(): Locator {
    return this.page.getByRole("button", { name: "Isi Borang Permohonan" });
  }
  get daftarTanpaValidasiButton(): Locator {
    return this.page.getByRole("button", { name: "Daftar tanpa Validasi" });
  }
}