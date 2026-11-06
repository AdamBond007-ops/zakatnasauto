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
    await this.page.waitForLoadState('load');
    await this.page.waitForTimeout(3000);
  }

  async uploadDokumenId(filePath: string, fileName: string): Promise<void> {
    await expect(this.main.dokumenIdPilihFailButton).toBeVisible({ timeout: 60000 });

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
    await this.page.waitForLoadState('load');
    await this.page.waitForTimeout(2000);
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

  async selectStatusPekerjaan(value: string): Promise<void> {
    const radio = this.main.statusPekerjaanRadio(value);
    await radio.click();
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
    await expect(this.main.pengesahanPendapatanPilihFailButton).toBeVisible({ timeout: 10000 });

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

  async clickTanggungan(): Promise<void> {
    await expect(this.main.tanggunganButton).toBeEnabled();
    await this.main.tanggunganButton.click();
  }

  async clickTambahTanggungan(): Promise<void> {
    await expect(this.main.tambahTanggunganButton).toBeEnabled();
    await this.main.tambahTanggunganButton.click();
  }

  async fillNamaTanggungan(value: string): Promise<void> {
    await this.main.tanggunganNamaInput.fill(value);
    await expect(this.main.tanggunganNamaInput).toHaveValue(value);
  }

  async selectJenisPengenalanTanggungan(option: string): Promise<void> {
    await this.selectFromDropdown(this.main.tanggunganJenisPengenalanContainer, option);
  }

  async fillNoPengenalanTanggungan(value: string): Promise<void> {
    await this.main.tanggunganNoPengenalanInput.fill(value);
    await expect(this.main.tanggunganNoPengenalanInput).toHaveValue(value);
  }

  /** Date input: format is YYYY-MM-DD. Disabled until Jenis Pengenalan is chosen. */
  async fillTarikhLahirTanggungan(value: string): Promise<void> {
    await expect(this.main.tanggunganTarikhLahirInput).toBeEnabled();
    await this.main.tanggunganTarikhLahirInput.fill(value);
    await expect(this.main.tanggunganTarikhLahirInput).toHaveValue(value);
  }

  async selectHubunganTanggungan(option: string): Promise<void> {
    await this.selectFromDropdown(this.main.tanggunganHubunganContainer, option);
  }

  async selectJantinaTanggungan(option: string): Promise<void> {
    await this.selectFromDropdown(this.main.tanggunganJantinaContainer, option);
  }

  async selectBangsaTanggungan(option: string): Promise<void> {
    await this.selectFromDropdown(this.main.tanggunganBangsaContainer, option);
  }

  async clickSimpanTanggungan(): Promise<void> {
    await expect(this.main.tanggunganSimpanButton).toBeEnabled();
    await this.main.tanggunganSimpanButton.click();
  }

  async clickBatalTanggungan(): Promise<void> {
    await this.main.tanggunganBatalButton.click();
  }

  /** index 0 = first tanggungan in the list. */
  async clickEditTanggungan(index = 0): Promise<void> {
    const button = this.main.editTanggunganButtons.nth(index);
    await expect(button).toBeVisible();
    await button.click();
  }

  async uploadTanggunganDokumenId(filePath: string, fileName: string): Promise<void> {
    await expect(this.main.tanggunganDokumenIdPilihFailButton).toBeVisible({ timeout: 10000 });

    const [fileChooser] = await Promise.all([
      this.page.waitForEvent("filechooser"),
      this.main.tanggunganDokumenIdPilihFailButton.click(),
    ]);
    await fileChooser.setFiles(filePath);

    // Upload to storage can take a moment: wait for the hidden value to fill in
    await expect(this.main.tanggunganDokumenIdValue).not.toHaveValue("[]", { timeout: 30_000 });
    await expect(this.main.tanggunganDokumenIdUpload.getByText(fileName)).toBeVisible();
    await expect(this.main.tanggunganDokumenIdUpload.getByText("Sedia")).toBeVisible();
  }

  async selectTanggunganTempohUnit(option: string): Promise<void> {
    await this.selectFromDropdown(this.main.tanggunganTempohUnitContainer, option);
  }

  async fillTanggunganTempohMenetap(value: string): Promise<void> {
    await this.main.tanggunganTempohNilaiInput.fill(value);
    await expect(this.main.tanggunganTempohNilaiInput).toHaveValue(value);
  }

  async selectTanggunganStatusPerkahwinan(option: string): Promise<void> {
    await this.selectFromDropdown(this.main.tanggunganStatusPerkahwinanContainer, option);
  }

  async selectTanggunganMuallaf(value: "Y" | "T"): Promise<void> {
    await this.chooseYaTidak("adakah_muallaf_tanggungan", value);
  }

  async selectTanggunganMuflis(value: "Y" | "T"): Promise<void> {
    await this.chooseYaTidak("muflis_disenarai_hitam", value);
  }

  async selectTanggunganTahapKesihatan(option: string): Promise<void> {
    await this.selectFromDropdown(this.main.tanggunganTahapKesihatanContainer, option);
  }

  async selectTanggunganMasihBersekolah(value: "Y" | "T" | "01" | "02"): Promise<void> {
    await this.chooseYaTidak("masih_bersekolah_tanggungan", value);
  }

  async selectTanggunganPendidikanTertinggi(option: string): Promise<void> {
    await this.selectFromDropdown(this.main.tanggunganPendidikanTertinggiContainer, option);
  }

  async selectTanggunganAdaPinjaman(value: "Y" | "T"): Promise<void> {
    await this.chooseYaTidak("ada_pinjaman_tanggungan", value);
  }

  async selectTanggunganAdaAset(value: "Y" | "T"): Promise<void> {
    await this.chooseYaTidak("ada_aset_tanggungan", value);
  }

  async selectTanggunganStatusPekerjaan(value: StatusPekerjaan): Promise<void> {
    const radio = this.main.tanggunganStatusPekerjaanRadio(value);
    await radio.check();
    await expect(radio).toBeChecked();
  }

  async clickBantuan(): Promise<void> {
    await expect(this.main.bantuanButton).toBeEnabled();
    await this.main.bantuanButton.click();
    await this.page.waitForLoadState('load');
    await this.page.waitForTimeout(2000);
  }

  async clickMohonBantuanBaru(): Promise<void> {
    await expect(this.main.mohonBantuanBaruButton).toBeEnabled();
    await this.main.mohonBantuanBaruButton.click();
    await this.page.waitForLoadState('load');
    await this.page.waitForTimeout(2000);
  }

  /** Click the upload icon and answer the file chooser (same approach as the other uploads). */
  private async uploadViaChooser(button: Locator, filePath: string): Promise<void> {
    await expect(button).toBeVisible();
    const [fileChooser] = await Promise.all([
      this.page.waitForEvent("filechooser"),
      button.click(),
    ]);
    await fileChooser.setFiles(filePath);
  }

  // --- Maklumat Permohonan Bantuan ---
  async selectAid(option: string): Promise<void> {
    await this.selectFromDropdown(this.main.aidContainer, option);
  }

  async selectAidProduct(option: string): Promise<void> {
    await this.selectFromDropdown(this.main.aidProductContainer, option);
  }

  async selectProductPackage(option: string): Promise<void> {
    await this.selectFromDropdown(this.main.productPackageContainer, option);
  }

  async setEntitlementProduct(name: string, checked = true): Promise<void> {
    const checkbox = this.main.entitlementCheckbox(name);

    // Only click when the state needs to change, so repeat calls don't toggle it back
    if ((await checkbox.isChecked()) !== checked) {
      await this.main.entitlementLabel(name).click();
    }
    await expect(checkbox).toBeChecked({ checked });
  }

  async setCashCounter(checked = true): Promise<void> {
    // Only click when the state needs to change, so repeat calls don't toggle it back
    if ((await this.main.cashCounterToggle.isChecked()) !== checked) {
      await this.main.cashCounterLabel.click();
    }
    await expect(this.main.cashCounterToggle).toBeChecked({ checked });
  }

  async fillPenyataanSebab(value: string): Promise<void> {
    await this.main.penyataanSebabInput.fill(value);
    await expect(this.main.penyataanSebabInput).toHaveValue(value);
  }

  // --- Maklumat Penerima Manfaat ---
  async selectNamaPenerima(option: string): Promise<void> {
    await this.selectFromDropdown(this.main.namaPenerimaContainer, option);
  }

  // --- Senarai Entitlement Product ---
  async expectEntitlementStatus(name: string, status: string): Promise<void> {
    await expect(this.main.entitlementCard(name).getByText(status, { exact: true })).toBeVisible();
  }

  async clickEditEntitlement(name: string): Promise<void> {
    await this.main.entitlementEditButton(name).click();
  }

  // --- Dokumen Sokongan (index 0 = first row) ---
  async uploadDokumenSokongan(index: number, filePath: string, fileName: string): Promise<void> {
    await this.uploadViaChooser(this.main.dokumenSokonganUploadButtons.nth(index), filePath);
    await expect(this.main.dokumenSokonganCard.getByText(fileName).first()).toBeVisible();
  }

  async selectStatusDokumenSokongan(index: number, option: string): Promise<void> {
    await this.selectFromDropdown(this.main.dokumenSokonganStatusContainer(index), option);
  }

  async fillCatatanDokumenSokongan(index: number, value: string): Promise<void> {
    await this.main.dokumenSokonganCatatan(index).fill(value);
  }

  // --- Dokumen Sokongan Dari LZS (index 0 = first row) ---
  async fillNamaDokumenLzs(index: number, value: string): Promise<void> {
    await this.main.dokumenLzsNamaInput(index).fill(value);
    await expect(this.main.dokumenLzsNamaInput(index)).toHaveValue(value);
  }

  async uploadDokumenLzs(index: number, filePath: string): Promise<void> {
    await this.uploadViaChooser(this.main.dokumenLzsUploadButtons.nth(index), filePath);
  }

  async fillCatatanDokumenLzs(index: number, value: string): Promise<void> {
    await this.main.dokumenLzsCatatan(index).fill(value);
  }

  async clickTambahDokumenLzs(): Promise<void> {
    await this.main.tambahDokumenLzsButton.click();
  }

  // --- Keputusan Siasatan ---
  async selectStatusSiasatan(option: string): Promise<void> {
    await this.selectFromDropdown(this.main.statusSiasatanContainer, option);
  }

  async fillCatatanSiasatan(value: string): Promise<void> {
    await this.main.catatanSiasatanInput.fill(value);
    await expect(this.main.catatanSiasatanInput).toHaveValue(value);
  }

  // --- Senarai Bantuan ---
  async clickTabLzs(): Promise<void> {
    await this.main.tabLzs.click();
  }

  async clickTabAgensi(): Promise<void> {
    await this.main.tabAgensi.click();
  }

  async selectTahun(option: string): Promise<void> {
    await this.selectFromDropdown(this.main.tahunContainer, option);
  }

  async clickDapatkanData(): Promise<void> {
    await this.main.dapatkanDataButton.click();
  }

  // --- Tindakan ---
  async expectStatusDokumenSokongan(status: string): Promise<void> {
    await expect(this.main.statusDokumenSokonganBadge).toHaveText(status);
  }

  async clickSimpanBantuan(): Promise<void> {
    await expect(this.main.simpanBantuanButton).toBeEnabled();
    await this.main.simpanBantuanButton.click();
  }

  async clickKembali(): Promise<void> {
    await this.main.kembaliButton.click();
  }

  /** Currency input: pass the formatted value, e.g. "200.00". */
  async fillKadarBantuan(value: string): Promise<void> {
    await this.main.kadarBantuanInput.fill(value);
    await expect(this.main.kadarBantuanInput).toHaveValue(value);
  }

  /** Confirmation popup shown after clicking Simpan. */
  async clickYaSimpan(): Promise<void> {
    await expect(this.main.swalYaSimpanButton).toBeVisible();
    await this.main.swalYaSimpanButton.click();
    await this.page.waitForLoadState('load');
    await this.page.waitForTimeout(1000);
  }

  async yaHantar(): Promise<void> {
    await expect(this.main.swalYaHantarButton).toBeVisible();
    await this.main.swalYaHantarButton.click();
    await this.page.waitForLoadState('load');
    await this.page.waitForTimeout(1000);
  }

  /** Success popup: closes it and waits for it to disappear. */
  async clickOk(): Promise<void> {
    await expect(this.main.swalOkButton).toBeVisible();
    await this.main.swalOkButton.click();
    await this.page.waitForLoadState('load');
    await this.page.waitForTimeout(1000);
    await expect(this.main.swalPopup).toBeHidden();
  }

  async clickTeruskanChoice(choice: "Ya, Teruskan" | "Tidak"): Promise<void> {
    const button = this.main.teruskanChoiceButton(choice);
    await expect(button).toBeVisible();
    await button.click();
  }

  // ------------------------------------------------
  //        Kaedah Siasatan
  // ------------------------------------------------

  /** Options: "Lapangan", "Semak Dokumen Sahaja", "Telefon" */
  async selectKaedahSiasatan(option: string): Promise<void> {
    await this.selectFromDropdown(this.main.kaedahSiasatanContainer, option);
  }

  async fillLaporanSiasatan(value: string): Promise<void> {
    await this.main.laporanSiasatanInput.fill(value);
    await expect(this.main.laporanSiasatanInput).toHaveValue(value);
  }

  /** Format YYYY-MM-DD. Defaults to today, and min is today so past dates are rejected. */
  async fillTarikhSiasatan(value: string): Promise<void> {
    await this.main.tarikhSiasatanInput.fill(value);
    await expect(this.main.tarikhSiasatanInput).toHaveValue(value);
  }

  /** Format HH:MM (24h), e.g. "10:30". */
  async fillMasaSiasatan(value: string): Promise<void> {
    await this.main.masaSiasatanInput.fill(value);
    await expect(this.main.masaSiasatanInput).toHaveValue(value);
  }

  /** Images only (accept="image/*"), max 5 MB. A PDF will not work here. */
  async uploadGambarSiasatan(filePath: string): Promise<void> {
    await expect(this.main.gambarSiasatanPilihFailButton).toBeVisible();
    const [fileChooser] = await Promise.all([
      this.page.waitForEvent("filechooser"),
      this.main.gambarSiasatanPilihFailButton.click(),
    ]);
    await fileChooser.setFiles(filePath);
    await expect(this.main.gambarSiasatanValue).not.toHaveValue("[]", { timeout: 30_000 });
  }

  async selectPengesahanLawatan(kaedah: "tandatangan" | "qr"): Promise<void> {
    const radio =
      kaedah === "tandatangan"
        ? this.main.pengesahanTandatanganRadio
        : this.main.pengesahanQrRadio;
    await radio.check();
    await expect(radio).toBeChecked();
  }

  /** Draws a simple zig-zag stroke on the signature canvas with real mouse events. */
  async lukisTandatangan(): Promise<void> {
    const canvas = this.main.tandatanganCanvas;
    await expect(canvas).toBeVisible();

    const box = await canvas.boundingBox();
    if (!box) throw new Error("Signature canvas not visible");

    const x = box.x;
    const y = box.y;
    const w = box.width;
    const h = box.height;

    await this.page.mouse.move(x + w * 0.2, y + h * 0.6);
    await this.page.mouse.down();
    await this.page.mouse.move(x + w * 0.3, y + h * 0.3, { steps: 8 });
    await this.page.mouse.move(x + w * 0.45, y + h * 0.7, { steps: 8 });
    await this.page.mouse.move(x + w * 0.6, y + h * 0.35, { steps: 8 });
    await this.page.mouse.move(x + w * 0.8, y + h * 0.6, { steps: 8 });
    await this.page.mouse.up();

    // Button stays disabled until the pad has a stroke
    await expect(this.main.sahkanLawatanButton).toBeEnabled();
  }

  async clickPadamTandatangan(): Promise<void> {
    await this.main.padamTandatanganButton.click();
    await expect(this.main.sahkanLawatanButton).toBeDisabled();
  }

  async clickSahkanLawatan(): Promise<void> {
    await expect(this.main.sahkanLawatanButton).toBeEnabled();
    await this.main.sahkanLawatanButton.click();
    await expect(this.main.tandatanganModal).toBeHidden();
  }

  async clickBatalTandatangan(): Promise<void> {
    await this.main.tandatanganBatalButton.click();
    await expect(this.main.tandatanganModal).toBeHidden();
  }

  // ------------------------------------------------
  //        Pengesahan
  // ------------------------------------------------

  async clickPengesahan(): Promise<void> {
    await expect(this.main.pengesahanButton).toBeEnabled();
    await this.main.pengesahanButton.click();
    await this.page.waitForLoadState('load');
    await this.page.waitForTimeout(2000);
  }

  async clickStepPengesahanAkhir(): Promise<void> {
    await this.main.stepPengesahanAkhir.click();
    await expect(this.main.pengesahanAkhirForm).toBeVisible();
  }

  async selectHubunganKakitanganLzs(value: "Y" | "T"): Promise<void> {
    const radio = this.main.hubunganKakitanganLzsRadio(value);
    await radio.check();
    await expect(radio).toBeChecked();
  }

  async selectHubunganPenolongAmil(value: "Y" | "T"): Promise<void> {
    const radio = this.main.hubunganPenolongAmilRadio(value);
    await radio.check();
    await expect(radio).toBeChecked();
  }

  async clickButiranAkaun(): Promise<void> {
    await this.main.butiranAkaunButton.click();
  }

  private async drawSignature1(canvas: Locator): Promise<void> {
    await expect(canvas).toBeVisible();
    await canvas.scrollIntoViewIfNeeded();

    const box = await canvas.boundingBox();
    if (!box) throw new Error("Signature canvas not visible");

    const { x, y, width: w, height: h } = box;

    await this.page.mouse.move(x + w * 0.2, y + h * 0.6);
    await this.page.mouse.down();
    await this.page.mouse.move(x + w * 0.3, y + h * 0.3, { steps: 15 });
    await this.page.mouse.move(x + w * 0.45, y + h * 0.7, { steps: 15 });
    await this.page.mouse.move(x + w * 0.6, y + h * 0.35, { steps: 15 });
    await this.page.mouse.move(x + w * 0.8, y + h * 0.6, { steps: 15 });
    await this.page.mouse.up();

    // Real proof of a stroke: some pixel on the canvas is no longer transparent
    await expect
      .poll(() =>
        canvas.evaluate((c: HTMLCanvasElement) => {
          const data = c.getContext("2d")!.getImageData(0, 0, c.width, c.height).data;
          for (let i = 3; i < data.length; i += 4) if (data[i] > 0) return true;
          return false;
        }),
      )
      .toBe(true);
  }

  /** Signature pad in the form (not the modal one). Same stroke approach as lukisTandatangan. */
  async lukisTandatanganPengesahanAkhir(): Promise<void> {
    await this.drawSignature1(this.main.pengesahanAkhirCanvas);
  }

  async clickPadamTandatanganPengesahanAkhir(): Promise<void> {
    await this.main.pengesahanAkhirPadamButton.click();
    await expect(this.main.pengesahanAkhirForm.getByText("Klik dan drag untuk tandatangan")).toBeVisible();
  }

  /** Readonly, set by the system. Pass YYYY-MM-DD (defaults to today). */
  async expectTarikhPerakuan(value = new Date().toISOString().slice(0, 10)): Promise<void> {
    await expect(this.main.tarikhPerakuanInput).toHaveValue(value);
  }

  async fillCatatanSokongan(value: string): Promise<void> {
    await this.main.catatanSokonganInput.fill(value);
    await expect(this.main.catatanSokonganInput).toHaveValue(value);
  }

  async clickHantar(): Promise<void> {
    await expect(this.main.hantarButton).toBeEnabled();
    await this.main.hantarButton.click();
    await this.page.waitForLoadState('load');
    await this.page.waitForTimeout(3000);
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