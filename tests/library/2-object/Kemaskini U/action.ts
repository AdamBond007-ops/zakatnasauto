import { expect, Page } from "@playwright/test";
import { KemaskiniUMain } from "@library/2-object/Kemaskini U/main";

export class KemaskiniUAction {
  private readonly main: KemaskiniUMain;

  constructor(private readonly page: Page) {
    this.main = new KemaskiniUMain(page);
  }

  async openCarianAsnaf(): Promise<void> {
    await this.main.menuCarianAsnaf.click();
    await expect(this.main.noPengenalanInput).toBeVisible();
  }

  async searchProfileByIc(ic: string): Promise<void> {
    await this.main.noPengenalanInput.fill(ic);
    await this.main.cariButton.click();

    const row = this.main.rowByIc(ic);
    await expect(row).toHaveCount(1);
  }

  async clickLihatProfil(ic: string): Promise<void> {
    const button = this.main.lihatProfilButton(this.main.rowByIc(ic));
    await expect(button).toBeVisible();
    await button.click();
    await expect(this.main.kemaskiniButton).toBeVisible();
  }

  async clickKemaskini(): Promise<void> {
    await this.main.kemaskiniButton.click();
    await expect(this.main.confirmKemaskiniButton).toBeVisible();
  }

  async confirmKemaskini(): Promise<void> {
    await this.main.confirmKemaskiniButton.click();
    await expect(this.main.maklumatPemohonTab).toBeVisible();
  }

  async selectTahapDaftarKemaskini(): Promise<void> {
    await this.main.tahapDaftarKemaskiniRadio.check();
    await expect(this.main.tahapDaftarKemaskiniRadio).toBeChecked();
  }

  async selectPendaftaranBaharuPerubahanMaklumat(): Promise<void> {
    await expect(this.main.pendaftaranBaharuPerubahanMaklumatRadio).toBeVisible();
    await this.main.pendaftaranBaharuPerubahanMaklumatRadio.check();
    await expect(this.main.pendaftaranBaharuPerubahanMaklumatRadio).toBeChecked();
  }

  async fillPernyataanMasalah(value: string): Promise<void> {
    await this.main.pernyataanMasalahInput.fill(value);
    await expect(this.main.pernyataanMasalahInput).toHaveValue(value);
  }

  async uploadAduanLampiran(filePath: string, fileName: string): Promise<void> {
    await expect(this.main.aduanLampiranPilihFailButton).toBeVisible({ timeout: 60_000 });

    const [fileChooser] = await Promise.all([
      this.page.waitForEvent("filechooser"),
      this.main.aduanLampiranPilihFailButton.click(),
    ]);
    await fileChooser.setFiles(filePath);

    await expect(this.main.aduanLampiranValue).not.toHaveValue("[]", { timeout: 30_000 });
    await expect(this.main.aduanLampiranUpload.getByText(fileName)).toBeVisible();
    await expect(this.main.aduanLampiranUpload.getByText("Sedia")).toBeVisible();
  }

  async clickMaklumatPemohon(): Promise<void> {
    await this.main.maklumatPemohonTab.click();
    await expect(this.main.tempatLahirInput).toBeVisible();
  }

  async fillTempatLahir(value: string): Promise<void> {
    await this.main.tempatLahirInput.fill(value);
    await expect(this.main.tempatLahirInput).toHaveValue(value.toLocaleUpperCase());
  }

  async selectTiadaTandatanganDigital(): Promise<void> {
    await this.main.tiadaTandatanganRadio.check();
    await expect(this.main.tiadaTandatanganRadio).toBeChecked();
  }

  async fillCatatan(value: string): Promise<void> {
    await this.main.catatanInput.fill(value);
    await expect(this.main.catatanInput).toHaveValue(value);
  }
}
