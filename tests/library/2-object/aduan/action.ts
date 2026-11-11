import { expect, Locator, Page } from "@playwright/test";
import { AduanMain } from "@library/2-object/aduan/main";

export interface AduanContactDetails {
  namaPenuh: string;
  jenisPengenalan: string;
  noPengenalan: string;
  emel?: string;
  noTelefon: string;
}

export interface AduanIndividuDetails extends AduanContactDetails {
  statusPerkahwinan: string;
  alamat1: string;
  alamat2?: string;
  alamat3?: string;
  poskod: string;
  kariah: string;
}

export class AduanAction {
  private readonly main: AduanMain;

  constructor(private readonly page: Page) {
    this.main = new AduanMain(page);
  }

  async daftarSebagaiPengaduWakil(): Promise<void> {
    await this.main.daftarSebagaiPengaduWakilButton.click();
    await expect(this.main.pengaduNamaPenuhInput).toBeVisible();
    await expect(this.main.aduanIndividuNamaPenuhInput).toBeVisible();
  }

  async fillMaklumatPengadu(details: AduanContactDetails): Promise<void> {
    await this.fillContactDetails(
      details,
      this.main.pengaduNamaPenuhInput,
      this.main.pengaduNoPengenalanInput,
      this.main.pengaduEmelInput,
      this.main.pengaduNoTelefonInput,
      "pengadu.jenis_pengenalan"
    );
  }

  async fillMaklumatIndividu(details: AduanIndividuDetails): Promise<void> {
    await this.fillContactDetails(
      details,
      this.main.aduanIndividuNamaPenuhInput,
      this.main.aduanIndividuNoPengenalanInput,
      this.main.aduanIndividuEmelInput,
      this.main.aduanIndividuNoTelefonInput,
      "aduan_individu.jenis_pengenalan"
    );
    await this.selectDropdown("aduan_individu.status_perkahwinan", details.statusPerkahwinan);
    await this.main.alamat1Input.fill(details.alamat1);
    if (details.alamat2 !== undefined) await this.main.alamat2Input.fill(details.alamat2);
    if (details.alamat3 !== undefined) await this.main.alamat3Input.fill(details.alamat3);
    await this.main.poskodInput.fill(details.poskod);
    await expect(this.main.poskodInput).toHaveValue(details.poskod);
    await expect(this.main.negeriSelect).not.toHaveValue("");
    await expect(this.main.daerahSelect).not.toHaveValue("");
    await expect(this.main.bandarInput).not.toHaveValue("");
    await this.selectDropdown("aduan_individu.kariah", details.kariah);
  }

  async selectTahapKeperluan(name: string, subOption?: string): Promise<void> {
    const radio = this.main.tahapKeperluanRadio(name);
    await radio.check();
    await expect(radio).toBeChecked();

    if (subOption) {
      const subRadio = this.main.tahapKeperluanSubRadio(subOption);
      await expect(subRadio).toBeVisible();
      await subRadio.check();
      await expect(subRadio).toBeChecked();
    }
  }

  async fillPernyataanMasalah(value: string): Promise<void> {
    await this.main.pernyataanMasalahInput.fill(value);
    await expect(this.main.pernyataanMasalahInput).toHaveValue(value);
  }

  async uploadLampiran(filePath: string): Promise<void> {
    await this.main.lampiranFileInput.setInputFiles(filePath);
    await expect(this.main.lampiranValue).not.toHaveValue("[]", { timeout: 30_000 });
  }

  async setConsent(accepted: boolean): Promise<void> {
    if (accepted) {
      await this.main.consentCheckbox.check();
    } else {
      await this.main.consentCheckbox.uncheck();
    }
    await expect(this.main.consentCheckbox).toBeChecked({ checked: accepted });
  }

  async clickHantar(): Promise<void> {
    await this.main.hantarButton.click();
  }

  async clickDaftarAkaun(): Promise<void> {
    const daftarAkaunButton = this.page.locator(
      'button:has-text("Daftar Akaun"), a:has-text("Daftar Akaun")'
    );
    await daftarAkaunButton.click();
  }


  private async fillContactDetails(
    details: AduanContactDetails,
    namaPenuhInput: Locator,
    noPengenalanInput: Locator,
    emelInput: Locator,
    noTelefonInput: Locator,
    jenisPengenalanName: string
  ): Promise<void> {
    await namaPenuhInput.fill(details.namaPenuh);
    await this.selectDropdown(jenisPengenalanName, details.jenisPengenalan);
    await noPengenalanInput.fill(details.noPengenalan);
    if (details.emel !== undefined) await emelInput.fill(details.emel);
    await noTelefonInput.fill(details.noTelefon);
  }

  private async selectDropdown(selectName: string, optionLabel: string): Promise<void> {
    const container = this.main.selectSearchContainer(selectName);
    const select = container.locator("select");
    const option = select.locator("option").filter({ hasText: optionLabel }).first();
    const optionValue = await option.getAttribute("value");
    const actualLabel = (await option.textContent())?.trim();
    if (!optionValue || !actualLabel) {
      throw new Error(`Option "${optionLabel}" was not found in "${selectName}".`);
    }

    await expect(select).toBeEnabled();
    const trigger = container.locator(".select-trigger");
    await expect(trigger).toBeVisible();
    await trigger.click();
    const listbox = this.page.getByRole("listbox").filter({ visible: true }).last();
    await expect(listbox).toBeVisible();
    await listbox.getByRole("option", { name: actualLabel, exact: true }).click();
    await expect(select).toHaveValue(optionValue);
    await expect(trigger).toContainText(actualLabel);
  }

  
  
}
