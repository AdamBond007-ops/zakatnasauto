import { expect, Locator, Page } from "@playwright/test";
import { KemaskiniUAMain } from "@library/2-object/Kemaskini UA/main";

export class KemaskiniUAAction {
  private readonly main: KemaskiniUAMain;

  constructor(private readonly page: Page) {
    this.main = new KemaskiniUAMain(page);
  }

  async selectMuflisYa(): Promise<void> {
    await this.main.muflisYaRadio.check();
    await expect(this.main.muflisYaRadio).toBeChecked();
    await expect(this.main.sebabMuflisInput).toBeVisible();
  }

  async fillSebabMuflis(value: string): Promise<void> {
    await this.main.sebabMuflisInput.fill(value);
    await expect(this.main.sebabMuflisInput).toHaveValue(value.toLocaleUpperCase());
  }

  async uploadDokumenMuflis(filePath: string, fileName: string): Promise<void> {
    await this.uploadFile(
      this.main.dokumenMuflisUpload,
      this.main.dokumenMuflisPilihFailButton,
      this.main.dokumenMuflisValue,
      filePath,
      fileName,
    );
  }

  async uploadDokumenBermastautin(filePath: string, fileName: string): Promise<void> {
    await this.uploadFile(
      this.main.dokumenBermastautinUpload,
      this.main.dokumenBermastautinPilihFailButton,
      this.main.dokumenBermastautinValue,
      filePath,
      fileName,
    );
  }

  private async uploadFile(
    upload: Locator,
    pilihFailButton: Locator,
    uploadedValue: Locator,
    filePath: string,
    fileName: string,
  ): Promise<void> {
    await expect(pilihFailButton).toBeVisible({ timeout: 60_000 });

    const [fileChooser] = await Promise.all([
      this.page.waitForEvent("filechooser"),
      pilihFailButton.click(),
    ]);
    await fileChooser.setFiles(filePath);

    await expect(uploadedValue).not.toHaveValue("[]", { timeout: 30_000 });
    await expect(upload.getByText(fileName)).toBeVisible();
    await expect(upload.getByText("Sedia")).toBeVisible();
  }
}