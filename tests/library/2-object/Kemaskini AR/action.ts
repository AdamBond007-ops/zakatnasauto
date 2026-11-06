import { expect, Locator, Page } from "@playwright/test";
import { KemaskiniARMain } from "@library/2-object/Kemaskini AR/main";

export class KemaskiniARAction {
  private readonly main: KemaskiniARMain;

  constructor(private readonly page: Page) {
    this.main = new KemaskiniARMain(page);
  }

  private async selectFromDropdown(container: Locator, optionText: string): Promise<void> {
    const trigger = container.locator(".select-trigger");
    await expect(trigger).toBeVisible();
    await trigger.scrollIntoViewIfNeeded();
    await trigger.click();

    await this.page
      .getByRole("option", { name: optionText, exact: true })
      .or(this.page.getByRole("listbox").getByText(optionText, { exact: true }))
      .first()
      .click();

    await expect(trigger).toContainText(optionText);
  }

  async selectSakitKronik(): Promise<void> {
    await this.selectFromDropdown(this.main.tahapKesihatanContainer, "Sakit Kronik");
    await expect(this.main.keadaanKesihatanSakitContainer).toBeVisible();
  }

  async selectKeadaanKesihatan(option: "Terlantar" | "Tidak Terlantar"): Promise<void> {
    await this.selectFromDropdown(this.main.keadaanKesihatanSakitContainer, option);
  }

  async selectKosPenjagaan(option: "Berbayar" | "Tidak Berbayar"): Promise<void> {
    await this.selectFromDropdown(this.main.kosPenjagaanSakitContainer, option);
  }

  async fillPerbelanjaanBulanan(value: string): Promise<void> {
    await this.main.perbelanjaanBulananSakitInput.fill(value);
    const escapedValue = value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    await expect(this.main.perbelanjaanBulananSakitInput).toHaveValue(
      new RegExp(`^${escapedValue}(?:[.,]00)?$`),
    );
  }

  async uploadDokumenSokonganKesihatan(filePath: string, fileName: string): Promise<void> {
    const upload = this.main.dokumenSokonganKesihatanUpload;
    const button = this.main.dokumenSokonganKesihatanPilihFailButton;
    await this.uploadFile(upload, button, filePath, fileName);
  }

  private async uploadFile(
    upload: Locator,
    button: Locator,
    filePath: string,
    fileName: string,
  ): Promise<void> {
    await expect(button).toBeVisible({ timeout: 60_000 });

    const [fileChooser] = await Promise.all([
      this.page.waitForEvent("filechooser"),
      button.click(),
    ]);
    await fileChooser.setFiles(filePath);

    await expect(upload.getByText(fileName)).toBeVisible();
    await expect(upload.getByText("Sedia")).toBeVisible();
  }
}