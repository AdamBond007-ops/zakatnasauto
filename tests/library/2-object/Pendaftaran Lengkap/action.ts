import { expect, Locator, Page } from "@playwright/test";
import { PendaftaranLengkapMain } from "@library/2-object/Pendaftaran Lengkap/main";
import { StatusPekerjaan } from "@library/2-object/Pendaftaran Lengkap/data";

export class AduanAction {
  private readonly main: PendaftaranLengkapMain;

  constructor(private readonly page: Page) {
    this.main = new PendaftaranLengkapMain(page);
  }

  /** Generic FormKit selectSearch: open, pick option, verify it shows. */
  private async selectFromDropdown(container: Locator, optionText: string): Promise<void> {
    const trigger = container.locator(".select-trigger");

    // Daerah / Kariah stay disabled until their parent has a value
    await expect(container.locator(".formkit-select-search")).not.toHaveClass(/is-disabled/);
    await trigger.scrollIntoViewIfNeeded();
    await trigger.click();

    try {
      await this.main.selectSearchOption(optionText).first().click({ timeout: 5_000 });
    } catch {
      // Fallback: hidden native <select>
      await container.locator("select").selectOption({ label: optionText }, { force: true });
    }

    await expect(trigger).toContainText(optionText);
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
  }

  async fillAlamat2(value: string): Promise<void> {
    await this.main.alamat2Input.fill(value);
  }

  async fillAlamat3(value: string): Promise<void> {
    await this.main.alamat3Input.fill(value);
  }

  /** Fills Poskod and waits for Negeri / Daerah / Bandar to auto-fill. */
  async fillPoskod(value: string): Promise<void> {
    await this.main.poskodInput.fill(value);
    await expect(this.main.poskodInput).toHaveValue(value);
    await expect(this.main.negeriContainer.locator("select")).toHaveValue(/.+/);
    await expect(this.main.daerahContainer.locator("select")).toHaveValue(/.+/);
    await expect(this.main.bandarInput).not.toHaveValue("");
  }

  async selectKariah(option: string): Promise<void> {
    await this.selectFromDropdown(this.main.kariahContainer, option);
  }

  async selectTahapKeperluan(parent: string, sub?: string): Promise<void> {
    await this.main.tahapRadio(parent).check();
    await expect(this.main.tahapRadio(parent)).toBeChecked();
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

  /** Opt-in, only if Simpan is blocked by a Lokasi validation error. */
  async pinLocationOnMap(): Promise<void> {
    const box = await this.main.map.boundingBox();
    if (!box) throw new Error("Map not visible");
    await this.main.map.click({ position: { x: box.width / 2, y: box.height / 2 } });
  }

  async setConsent(checked = true): Promise<void> {
    await this.main.consentCheckbox.setChecked(checked);
    await expect(this.main.consentCheckbox).toBeChecked({ checked });
  }

  async clickSimpan(): Promise<void> {
    await expect(this.main.simpanButton).toBeEnabled();
    await this.main.simpanButton.click();
  }

  async uploadDokumenId(filePath: string, fileName: string): Promise<void> {
    await expect(this.main.dokumenIdPilihFailButton).toBeVisible({timeout: 10000});

    const [fileChooser] = await Promise.all([
      this.page.waitForEvent("filechooser"),
      this.main.dokumenIdPilihFailButton.click(),
    ]);
    await fileChooser.setFiles(filePath);

    // Upload to storage can take a moment: wait for the hidden value to fill in
    await expect(this.main.dokumenIdValue).not.toHaveValue("[]", { timeout: 30_000 });
    await expect(this.main.dokumenIdUpload.getByText(fileName)).toBeVisible();
    await expect(this.main.dokumenIdUpload.getByText("Sedia")).toBeVisible();
  }

  async fillEmel(value: string): Promise<void> {
    await this.main.emelInput.fill(value);
    await expect(this.main.emelInput).toHaveValue(value);
  }

  async selectTempohUnit(option: string): Promise<void> {
    await this.selectFromDropdown(this.main.tempohUnitContainer, option);
  }

  async fillTempohMenetap(value: string): Promise<void> {
    await this.main.tempohNilaiInput.fill(value);
    await expect(this.main.tempohNilaiInput).toHaveValue(value);
  }

  async selectStatusKediaman(option: string): Promise<void> {
    await this.selectFromDropdown(this.main.statusKediamanContainer, option);
  }

  async selectKeadaanKediaman(option: string): Promise<void> {
    await this.selectFromDropdown(this.main.keadaanKediamanContainer, option);
  }

  private async chooseYaTidak(name: string, value: "Y" | "T" | "01" | "02"): Promise<void> {
    const radio = this.main.radioYaTidak(name, value);
    await radio.check();
    await expect(radio).toBeChecked();
  }

  async selectMuallaf(value: "Y" | "T"): Promise<void> {
    await this.chooseYaTidak("adakah_muallaf", value);
  }

  async selectMuflis(value: "Y" | "T"): Promise<void> {
    await this.chooseYaTidak("muflis_disenarai_hitam", value);
  }

  async selectAdaAkaunBank(value: "Y" | "T"): Promise<void> {
    await this.chooseYaTidak("ada_akaun_bank", value);
  }

  async selectNamaBank(option: string): Promise<void> {
    await this.selectFromDropdown(this.main.namaBankContainer, option);
  }

  async fillNoAkaunBank(value: string): Promise<void> {
    await this.main.noAkaunBankInput.fill(value);
    await expect(this.main.noAkaunBankInput).toHaveValue(value);
  }

  /** Not in the codegen. The page shows "No. akaun bank belum disahkan" until this is clicked. */
  async clickSemakAkaun(): Promise<void> {
    await this.main.semakAkaunButton.click();
  }

  async uploadPenyataBank(filePath: string, fileName: string): Promise<void> {
    await this.main.penyataBankFileInput.setInputFiles(filePath);
    await expect(this.main.penyataBankUpload.getByText(fileName)).toBeVisible();
    await expect(this.main.penyataBankUpload.getByText("Sedia")).toBeVisible();
  }

  async selectTahapKesihatan(option: string): Promise<void> {
    await this.selectFromDropdown(this.main.tahapKesihatanContainer, option);
  }

  async clickSeterusnya(): Promise<void> {
    await expect(this.main.seterusnyaButton).toBeEnabled();
    await this.main.seterusnyaButton.click();
  }

  async selectMasihBelajar(value: "Y" | "T" | "01" | "02"): Promise<void> {
    await this.chooseYaTidak("masih_bersekolah", value);
  }

  async selectPendidikanTertinggi(option: string): Promise<void> {
    await this.selectFromDropdown(this.main.pendidikanTertinggiContainer, option);
  }

  async selectAdaKemahiran(value: "Y" | "T"): Promise<void> {
    await this.chooseYaTidak("ada_kemahiran", value);
  }

  async selectAdaPinjaman(value: "Y" | "T"): Promise<void> {
    await this.chooseYaTidak("ada_pinjaman", value);
  }

  async selectAdaAset(value: "Y" | "T"): Promise<void> {
    await this.chooseYaTidak("ada_aset", value);
  }

  async selectStatusPekerjaan(value: StatusPekerjaan): Promise<void> {
    const radio = this.main.statusPekerjaanRadio(value);
    await radio.check();
    await expect(radio).toBeChecked();
  }

  async selectSektorPekerjaan(option: string): Promise<void> {
    await this.selectFromDropdown(this.main.sektorPekerjaanContainer, option);
  }

  async fillPendapatanKasar(value: string): Promise<void> {
    await this.main.pendapatanKasarInput.fill(value);
    await expect(this.main.pendapatanKasarInput).toHaveValue(value);
  }

  async uploadPengesahanPendapatan(filePath: string, fileName: string): Promise<void> {
    await expect(this.main.pengesahanPendapatanPilihFailButton).toBeVisible({timeout: 10000});

    const [fileChooser] = await Promise.all([
      this.page.waitForEvent("filechooser"),
      this.main.pengesahanPendapatanPilihFailButton.click(),
    ]);
    await fileChooser.setFiles(filePath);

    // Upload to storage can take a moment: wait for the hidden value to fill in
    await expect(this.main.pengesahanPendapatanValue).not.toHaveValue("[]", { timeout: 30_000 });
    await expect(this.main.pengesahanPendapatanUpload.getByText(fileName)).toBeVisible();
    await expect(this.main.pengesahanPendapatanUpload.getByText("Sedia")).toBeVisible();
  }

  async clickSelesai(): Promise<void> {
    await expect(this.main.selesaiButton).toBeEnabled();
    await this.main.selesaiButton.click();
  }

  async pilihKakitanganLzs(value: 'Y' | 'T'): Promise<void> {
    const optionLocator = this.page.locator(`input[name="hubungan_kakitangan_lzs"][value="${value}"]`);
    await optionLocator.click();
    await expect(optionLocator).toBeChecked();
  }

  async pilihPenolongAmil(value: 'Y' | 'T'): Promise<void> {
    const optionLocator = this.page.locator(`input[name="hubungan_penolong_amil"][value="${value}"]`);
    await optionLocator.click();
    await expect(optionLocator).toBeChecked();
  }

   async drawSignature(): Promise<void> {
     const canvas = this.page.locator('canvas').first();
     await canvas.waitFor({ state: 'visible' });
     await canvas.scrollIntoViewIfNeeded();
     const box = await canvas.boundingBox();

     if (!box) {
       throw new Error('Canvas bounding box not found');
     }
    await this.page.mouse.move(box.x + 20, box.y + box.height / 2);
    await this.page.mouse.down();
    await this.page.mouse.move(box.x + box.width / 4, box.y + 10);
    await this.page.mouse.move(box.x + box.width / 2, box.y + box.height - 10);
    await this.page.mouse.move(box.x + (box.width * 3) / 4, box.y + 20);
    await this.page.mouse.move(box.x + box.width - 20, box.y + box.height / 2);
    await this.page.mouse.up();
  
  }

  //EOAD Adam buat

  async pilihMasihBersekolah(value: '01' | '02'): Promise<void> {
    const optionLocator = this.page.locator(`input[name="masih_bersekolah"][value="${value}"]`);
    await optionLocator.click();
    await expect(optionLocator).toBeChecked();
  }

  async pilihAdaKemahiran(value: 'Y' | 'T'): Promise<void> {
    const optionLocator = this.page.locator(`input[name="ada_kemahiran"][value="${value}"]`);
    await optionLocator.click();
    await expect(optionLocator).toBeChecked();
  }

  async pilihAdaPinjaman(value: 'Y' | 'T'): Promise<void> {
    const optionLocator = this.page.locator(`input[name="ada_pinjaman"][value="${value}"]`);
    await optionLocator.click();
    await expect(optionLocator).toBeChecked();
  }

  async pilihAdaAset(value: 'Y' | 'T'): Promise<void> {
    const optionLocator = this.page.locator(`input[name="ada_aset"][value="${value}"]`);
    await optionLocator.click();
    await expect(optionLocator).toBeChecked();
  }

  async drawSignatureEOAD(): Promise<void> {
    const canvas = this.page.locator('canvas').first();
    await canvas.waitFor({ state: 'visible' });
    await canvas.scrollIntoViewIfNeeded();
    const box = await canvas.boundingBox();

    if (!box) {
      throw new Error('Canvas bounding box not found');
    }

    // Click and drag across the canvas to simulate a signature
    await this.page.mouse.move(box.x + 20, box.y + box.height / 2);
    await this.page.mouse.down();
    await this.page.mouse.move(box.x + box.width / 4, box.y + 10);
    await this.page.mouse.move(box.x + box.width / 2, box.y + box.height - 10);
    await this.page.mouse.move(box.x + (box.width * 3) / 4, box.y + 20);
    await this.page.mouse.move(box.x + box.width - 20, box.y + box.height / 2);
    await this.page.mouse.up();
  }

  async pilihSokongan(value: 'SOKONG' | 'BATAL'): Promise<void> {
    const selectLocator = this.page.locator('select[name="keputusan"]');
    const optionLabel = await selectLocator.locator(`option[value="${value}"]`).textContent();
    if (!optionLabel) {
      throw new Error(`No keputusan option found for value "${value}"`);
    }

    const selectTrigger = selectLocator.locator('..').locator('.select-trigger');
    await selectTrigger.click();

    const escapedLabel = optionLabel.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const option = this.page
      .locator('span:visible')
      .filter({ hasText: new RegExp(`^${escapedLabel}$`) })
      .last();
    await expect(option).toBeVisible();
    await option.click();

    await expect(selectLocator).toHaveValue(value);
  }

  async pilihKeputusan(value: 'LULUS' | 'PINDAAN'): Promise<void> {
    const selectLocator = this.page.locator('select[name="keputusan"]');
    const optionLabel = await selectLocator.locator(`option[value="${value}"]`).textContent();
    if (!optionLabel) {
      throw new Error(`No keputusan option found for value "${value}"`);
    }

    const selectTrigger = selectLocator.locator('..').locator('.select-trigger');
    await selectTrigger.click();

    const escapedLabel = optionLabel.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const option = this.page
      .locator('span:visible')
      .filter({ hasText: new RegExp(`^${escapedLabel}$`) })
      .last();
    await expect(option).toBeVisible();
    await option.click();

    await expect(selectLocator).toHaveValue(value);
  }

  async pilihMuflisDisenaraiHitam(value: 'Y' | 'T'): Promise<void> {
    const optionLocator = this.page.locator(`input[name="muflis_disenarai_hitam"][value="${value}"]`);
    await optionLocator.click();
    await expect(optionLocator).toBeChecked();
  }
}