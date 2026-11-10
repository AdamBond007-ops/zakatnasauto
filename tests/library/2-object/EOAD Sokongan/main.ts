import { Locator, Page } from "@playwright/test";

export class EoadSokonganMain {
  constructor(private readonly page: Page) {}

  get menuSokongan(): Locator {
    return this.page.locator("a").filter({ hasText: "Sokongan" });
  }

  get searchInput(): Locator {
    return this.page.getByRole("searchbox", { name: "Cari..." });
  }

  get lihatSokonganButton(): Locator {
    return this.page.getByRole("button", { name: "Lihat Sokongan" });
  }

  get bantuanTab(): Locator {
    return this.page.getByRole("button", { name: "Bantuan", exact: true });
  }

  get lihatKemaskiniButton(): Locator {
    return this.page.getByRole("button", { name: "Lihat / Kemaskini" });
  }

  get statusSiasatanContainer(): Locator {
    return this.page
      .locator('[data-type="selectSearch"]')
      .filter({ has: this.page.getByText("Status Siasatan*", { exact: true }) });
  }

  selectSearchOption(optionText: string): Locator {
    return this.page
      .getByRole("option", { name: optionText, exact: true })
      .or(this.page.getByRole("listbox").getByText(optionText, { exact: true }));
  }

  get catatanSiasatanInput(): Locator {
    return this.page.getByPlaceholder("Masukkan catatan, dapatan dan pemerhatian semasa siasatan...");
  }

  get simpanButton(): Locator {
    return this.page.getByRole("button", { name: "Simpan", exact: true });
  }

  get keputusanSelect(): Locator {
    return this.page.locator('select[name="keputusan"]');
  }

  get catatanSokonganInput(): Locator {
    return this.page.getByPlaceholder("Masukkan catatan sokongan...");
  }

  get hantarButton(): Locator {
    return this.page.getByRole("button", { name: "Hantar", exact: true });
  }

  get yaHantarButton(): Locator {
    return this.page.getByRole("button", { name: "Ya, Hantar" });
  }

  get okButton(): Locator {
    return this.page.getByRole("button", { name: "OK" });
  }
}
