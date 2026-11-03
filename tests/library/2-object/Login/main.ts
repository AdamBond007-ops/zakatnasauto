import { Locator, Page } from "@playwright/test";

export class LoginMain {
  constructor(private readonly page: Page) {}

  get idPenggunaInput(): Locator {
    return this.page.getByRole("textbox", { name: "ID Pengguna" });
  }
  get kataLaluanInput(): Locator {
    return this.page.getByRole("textbox", { name: "Kata Laluan*" });
  }
  get logMasukButton(): Locator {
    return this.page.getByRole("button", { name: "Log Masuk", exact: true });
  }
  get logKeluarButton(): Locator {
    return this.page.getByRole("button", { name: "Log Keluar" });
  }
}