import { expect, Locator, Page } from "@playwright/test";
import { PAKDaftarMain } from "@library/2-object/PAK Daftar/main";

export class PAKDaftarAction {
  private readonly main: PAKDaftarMain;

  constructor(private readonly page: Page) {
    this.main = new PAKDaftarMain(page);
  }

  private async selectFromDropdown(container: Locator, optionText: string): Promise<void> {
    const trigger = container.locator(".select-trigger");
    await expect(trigger).toBeVisible();
    await expect(container.locator(".formkit-select-search")).not.toHaveClass(/is-disabled/);
    await trigger.scrollIntoViewIfNeeded();
    await trigger.click();
    await this.main.selectSearchOption(optionText).first().click();
    await expect(trigger).toContainText(optionText);
  }

  async fillEmel(value: string): Promise<void> {
    await this.main.emelInput.fill(value);
    await expect(this.main.emelInput).toHaveValue(value);
  }

  async fillNoTelefon(value: string): Promise<void> {
    await this.main.noTelefonInput.fill(value);
    await expect(this.main.noTelefonInput).toHaveValue(value);
  }

  async selectStatusPerkahwinan(option: string): Promise<void> {
    await this.selectFromDropdown(this.main.statusPerkahwinanContainer, option);
  }

  async fillAlamat1(value: string): Promise<void> {
    await this.main.alamat1Input.fill(value);
    await expect(this.main.alamat1Input).toHaveValue(value);
  }

  async fillAlamat2(value: string): Promise<void> {
    await this.main.alamat2Input.fill(value);
    await expect(this.main.alamat2Input).toHaveValue(value);
  }

  async fillAlamat3(value: string): Promise<void> {
    await this.main.alamat3Input.fill(value);
    await expect(this.main.alamat3Input).toHaveValue(value);
  }

  async fillPoskod(): Promise<void> {
    await this.main.poskodInput.fill("45700");
    await expect(this.main.poskodInput).toHaveValue("45700");
    await expect(this.main.negeriContainer.locator("select")).toHaveValue(/.+/);
    await expect(this.main.daerahContainer.locator("select")).toHaveValue(/.+/);
    await expect(this.main.bandarInput).not.toHaveValue("");
  }

  async selectKariahAlNaim(): Promise<void> {
    await this.selectFromDropdown(this.main.kariahContainer, "MASJID AL NAIM");
  }

  async selectTahapKeperluan(parent: string, sub?: string): Promise<void> {
    const parentRadio = this.main.tahapRadio(parent);
    await parentRadio.check();
    await expect(parentRadio).toBeChecked();

    if (sub) {
      const subRadio = this.main.tahapSubRadio(sub);
      await expect(subRadio).toBeVisible();
      await subRadio.check();
      await expect(subRadio).toBeChecked();
    }
  }

  async fillPernyataanMasalah(value: string): Promise<void> {
    await this.main.pernyataanMasalahInput.fill(value);
    await expect(this.main.pernyataanMasalahInput).toHaveValue(value);
  }

  async uploadLampiran(filePath: string, fileName: string): Promise<void> {
    await expect(this.main.lampiranPilihFailButton).toBeVisible({ timeout: 60_000 });

    const [fileChooser] = await Promise.all([
      this.page.waitForEvent("filechooser"),
      this.main.lampiranPilihFailButton.click(),
    ]);
    await fileChooser.setFiles(filePath);

    await expect(this.main.lampiranValue).not.toHaveValue("[]", { timeout: 30_000 });
    await expect(this.main.lampiranUpload.getByText(fileName)).toBeVisible();
    await expect(this.main.lampiranUpload.getByText("Sedia")).toBeVisible();
  }

  async acceptTerms(): Promise<void> {
    await this.main.consentCheckbox.check();
    await expect(this.main.consentCheckbox).toBeChecked();
  }

  async fillTempatLahir(value: string): Promise<void> {
    await this.main.tempatLahirInput.fill(value);
    await expect(this.main.tempatLahirInput).toHaveValue(value.toLocaleUpperCase());
  }

  async selectTempohUnit(option: "Hari" | "Bulan" | "Tahun" | "Seumur Hidup"): Promise<void> {
    await this.selectFromDropdown(this.main.tempohUnitContainer, option);
  }

  async fillTempohMenetap(value: string): Promise<void> {
    await this.main.tempohMenetapInput.fill(value);
    await expect(this.main.tempohMenetapInput).toHaveValue(value);
  }
}