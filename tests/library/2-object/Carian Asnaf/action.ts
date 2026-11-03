import { expect, Page } from "@playwright/test";
import { CarianAsnafMain } from "@library/2-object/Carian Asnaf/main";

export class CarianAsnafAction {
  private readonly main: CarianAsnafMain;

  constructor(private readonly page: Page) {
    this.main = new CarianAsnafMain(page);
  }

  async openCarianAsnaf(): Promise<void> {
    await this.main.menuCarianAsnaf.click();
    await expect(this.main.cariButton).toBeVisible();
  }

  async selectJenisPengenalan(option: string): Promise<void> {
    await this.main.jenisPengenalanTrigger.click();
    await this.main.jenisPengenalanOption(option).click();
  }

  async fillNoPengenalan(value: string): Promise<void> {
    await this.main.noPengenalanInput.fill(value);
    await expect(this.main.noPengenalanInput).toHaveValue(value);
  }

  async fillNama(value: string): Promise<void> {
    await this.main.namaInput.fill(value);
  }

  async clickCari(): Promise<void> {
    await this.main.cariButton.click();
  }

  async clickIsiBorangPermohonan(): Promise<void> {
    await this.main.isiBorangButton.click();
  }

  async clickDaftarTanpaValidasi(): Promise<void> {
    await this.main.daftarTanpaValidasiButton.click();
  }
}