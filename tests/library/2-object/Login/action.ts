import { expect, Page } from "@playwright/test";
import { LoginMain } from "@library/2-object/Login/main";

export class LoginAction {
  private readonly main: LoginMain;

  constructor(private readonly page: Page) {
    this.main = new LoginMain(page);
  }

  async goto(): Promise<void> {
    await this.page.goto("https://stg.nas-internal.com/login");
  }

  async fillIdPengguna(value: string): Promise<void> {
    await this.main.idPenggunaInput.fill(value);
    await expect(this.main.idPenggunaInput).toHaveValue(value);
  }

  async fillKataLaluan(value: string): Promise<void> {
    await this.main.kataLaluanInput.fill(value);
  }

  async clickLogMasuk(): Promise<void> {
    await this.main.logMasukButton.click();
  }

  async logout(): Promise<void> {
    await this.main.logKeluarButton.click();
    await expect(this.main.logMasukButton).toBeVisible();
  }
}