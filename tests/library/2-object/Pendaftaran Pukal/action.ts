import { expect, Locator, Page } from '@playwright/test';
import { PendaftaranPantasPukalLocator } from './main';
import path from 'node:path';

export class PendaftaranPantasPukalAction {
  private readonly locator: PendaftaranPantasPukalLocator;

  constructor(private readonly page: Page) {
    this.locator = new PendaftaranPantasPukalLocator(page);
  }

  async clickPendaftaranPantasPukal(): Promise<void> {
    await expect(this.locator.getPendaftaranPantasPukalButton).toBeVisible();
    await this.locator.getPendaftaranPantasPukalButton.click();
  }

  async clickBantuanPantasMenu(): Promise<void> {
    await expect(this.locator.getBantuanPantasMenu).toBeVisible();
    await this.locator.getBantuanPantasMenu.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Clicks "Permohonan pukal".
   * @param rowText optional row text (e.g. 'HQ ZAKAT SELANGOR'); defaults to first row button
   */
  async clickPermohonanPukal(rowText?: string | RegExp): Promise<void> {
    const button = rowText
      ? this.locator.getPermohonanPukalButtonInRow(rowText)
      : this.locator.getPermohonanPukalButton;

    await expect(button).toBeVisible();
    await button.click();
  }

  async clickMohonBantuan(): Promise<void> {
    await expect(this.locator.getMohonBantuanButton).toBeVisible();
    await this.locator.getMohonBantuanButton.click();
  }

  async clickIndividu(): Promise<void> {
    await expect(this.locator.getIndividuButton).toBeVisible();
    await this.locator.getIndividuButton.click();
  }

  /** Convenience method for the full happy-path flow */
  async navigateToIndividuForm(rowText?: string | RegExp): Promise<void> {
    await this.clickPendaftaranPantasPukal();
    await this.clickBantuanPantasMenu();
    await this.clickPermohonanPukal(rowText);
    await this.clickMohonBantuan();
    await this.clickIndividu();
  }

    // ---------- IC lookup ----------

  /** Choose Jenis Pengenalan. Default = MyKad / MyKid. */
    /** Choose Jenis Pengenalan via the visible UI (MyKad / MyKid by default). */
  async selectJenisPengenalan(label = 'MyKad / MyKid'): Promise<void> {
    await this.locator.getJenisPengenalanTrigger.click();
    await this.page.getByRole('option', { name: label, exact: true }).click();

    // Assert the component state actually propagated
    await expect(this.locator.getJenisPengenalanSelectedValue).toHaveText(label);
  }

  /** Fill No. Pengenalan (waits for the field to become enabled). */
  async fillNoPengenalan(ic: string): Promise<void> {
    const input = this.locator.getNoPengenalanInput;
    await expect(input).toBeEnabled();
    await input.fill(ic);
    await expect(input).toHaveValue(ic);
  }

  /** Click Cari (waits for it to become enabled). */
  async clickCari(): Promise<void> {
    const btn = this.locator.getCariButton;
    await expect(btn).toBeEnabled();
    await btn.click();
  }

    /** Pick MyKad → fill IC → click Cari. */
  async lookupByIc(ic: string): Promise<void> {
    await this.selectJenisPengenalan();        // defaults to 'MyKad / MyKid'
    await this.fillNoPengenalan(ic);
    await this.clickCari();
  }

    // ---------- Add-to-list / assign bantuan ----------

  async clickTambahKeSenarai(): Promise<void> {
    const btn = this.locator.getTambahKeSenaraiButton;
    await expect(btn).toBeEnabled();
    await btn.click();
  }

  /**
   * Clicks "Tetapkan bantuan" on the card for the given kategori.
   * Defaults to 'Fakir'. Use exactly 'Fakir' (not 'Non Fakir/Miskin').
   */
  async clickTetapkanBantuan(kategori = 'Fakir'): Promise<void> {
    const btn = this.locator.getTetapkanBantuanButtonForKategori(kategori);
    await expect(btn).toBeVisible();
    await btn.click();
  }

  /** Convenience: add the filled applicant, then assign the Fakir card. */
  async addToListAndAssignFakir(): Promise<void> {
    await this.clickTambahKeSenarai();
    await this.clickTetapkanBantuan('Fakir');
  }

    // ---------- Maklumat Bantuan ----------

  /**
   * Opens a FormKit selectSearch via its visible trigger and picks an option.
   * Waits on the hidden <select> to become enabled first (cascade loading).
   */
    private async selectSearchOption(
    hiddenSelect: Locator,
    trigger: Locator,
    optionText: string
  ): Promise<void> {
    // 1. Wait until the component is enabled
    await expect(hiddenSelect).toBeEnabled({ timeout: 15000 });

    // 2. Open the dropdown
    await trigger.click();

    // 3. Pick the option
    const option = this.page.getByRole('option', { name: optionText, exact: true });
    await expect(option).toBeVisible({ timeout: 15000 });
    await option.click();

    // 4. Assert the trigger now displays the selection
    await expect(trigger).toContainText(optionText); 
  }

  async fillMaklumatBantuan(
    aid: string,
    aidProduct: string,
    productPackage: string,
    entitlementProduct: string,
    amaun: string
  ): Promise<void> {
    await this.selectSearchOption(
      this.locator.getAidSelect,
      this.locator.getAidTrigger,
      aid
    );
    await this.selectSearchOption(
      this.locator.getAidProductSelect,
      this.locator.getAidProductTrigger,
      aidProduct
    );
    await this.selectSearchOption(
      this.locator.getProductPackageSelect,
      this.locator.getProductPackageTrigger,
      productPackage
    );
    await this.selectSearchOption(
      this.locator.getEntitlementProductSelectE2E01,
      this.locator.getEntitlementProductTriggerE2E01,
      entitlementProduct
    );

    const amaunInput = this.locator.getAmaunBantuanInput;
    await expect(amaunInput).toBeEnabled({ timeout: 15000 });
    await amaunInput.fill(amaun);
  }

    async fillMaklumatBantuanAndTarikh(
    aid: string,
    aidProduct: string,
    productPackage: string,
    entitlementProduct: string,
    tarikh: string
  ): Promise<void> {
    await this.selectSearchOption(
      this.locator.getAidSelect,
      this.locator.getAidTrigger,
      aid
    );
    await this.selectSearchOption(
      this.locator.getAidProductSelect,
      this.locator.getAidProductTrigger,
      aidProduct
    );
    await this.selectSearchOption(
      this.locator.getProductPackageSelect,
      this.locator.getProductPackageTrigger,
      productPackage
    );
    await this.selectSearchOption(
      this.locator.getEntitlementProductSelectE2E04,
      this.locator.getEntitlementProductTriggerE2E04,
      entitlementProduct
    );

    // Fill the Date
    const tarikhInput = this.locator.getTarikhJangkaanBayaranInputNonEOAD;
    await expect(tarikhInput).toBeVisible({ timeout: 15000 });
    await tarikhInput.fill(tarikh);
  }

    // ---------- Senarai Pemohon (selection + submit) ----------

      async checkApplicantAt(index: number): Promise<void> {
    const cb = this.locator.getApplicantCheckboxAt(index);
    await expect(cb).toBeVisible();
    await cb.check();
    await expect(cb).toBeChecked();
  }

    

  // ---------- Dokumen Sokongan (upload per row) ----------

  /**
   * Uploads one or more files to the given document row.
   * Bypasses the upload button (native OS dialog) by writing directly to the
   * hidden <input type="file"> — Playwright's supported approach for hidden inputs.
   * Some upload components clear the input after handling the change event, so
   * the input's files list is not a reliable post-upload check.
   */
  async uploadDocument(
    name: string | RegExp,
    filePaths: string | string[]
  ): Promise<void> {
    const input = this.locator.getDocumentFileInput(name);
    await input.setInputFiles(filePaths);
  }

  /** Optional: fill the catatan/remarks field on the same row. */
  async fillDocumentCatatan(name: string | RegExp, text: string): Promise<void> {
    await this.locator.getDocumentCatatan(name).fill(text);
  }

  /**
   * Submits the selected applicants.
   * Optionally verifies the button reflects the expected count (default 1).
   */
  async clickHantar(expectedCount = 1): Promise<void> {
    const btn = this.locator.getHantarButton;
    await expect(btn).toBeVisible();
    await expect(btn).toHaveText(
      new RegExp(`Hantar\\s*\\(${expectedCount}\\)`)
    );
    await btn.click();
  }

  // ---------- Bulk Processing Menu ----------

  async clickBulkProcessing(): Promise<void> {
    const btn = this.locator.getBulkProcessingButton;
    await expect(btn).toBeVisible();
    await btn.click();
  }

  async clickSenaraiBulkProcessing(): Promise<void> {
    const menu = this.locator.getSenaraiBulkProcessingMenu;
    
    // Playwright will automatically wait for the sub-menu to expand 
    // and become visible after the parent button is clicked
    await expect(menu).toBeVisible();
    await menu.click();
    
    await this.page.waitForLoadState('networkidle');
  }

async clickCiptaBulkProcessing(): Promise<void> {
    const menu = this.locator.getCiptaBulkProcessingMenu;
    await expect(menu).toBeVisible();
    await menu.click();
    await this.page.waitForLoadState('networkidle');
  }

  /** Convenience method: Expand Bulk Processing and click Senarai */
  async navigateToSenaraiBulkProcessing(): Promise<void> {
    await this.clickBulkProcessing();
    await this.clickSenaraiBulkProcessing();
  }

  /** Convenience method: Expand Bulk Processing and click Cipta */
  async navigateToCiptaBulkProcessing(): Promise<void> {
    await this.clickBulkProcessing();
    await this.clickCiptaBulkProcessing();
  }

    // ---------- Table Actions (Semakan) ----------

  /** Clicks the first visible "Semakan" button on the page */
  async clickSemakan(): Promise<void> {
    const btn = this.locator.getSemakanButton;
    await expect(btn).toBeVisible();
    await btn.click();
  }

  /** Clicks the "Semakan" button for a specific table row (0-based index) */
  async clickSemakanInRow(index: number): Promise<void> {
    const btn = this.locator.getSemakanButtonInRow(index);
    await expect(btn).toBeVisible();
    await btn.click();
  }

    // ---------- Semakan (Review) Flow ----------

  /** Fills the expected payment date with today's date (YYYY-MM-DD) */
  async fillTarikhJangkaanBayaran(): Promise<void> {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${yyyy}-${mm}-${dd}`;

    const input = this.locator.getTarikhJangkaanBayaranInput;
    await expect(input).toBeVisible();
    await input.fill(formattedDate);
  }

    async checkSemakanCheckbox(): Promise<void> {
    // Option A: Click the specific checkbox (using the fixed locator above)
    const cb = this.locator.getSemakanCheckbox;
    await expect(cb).toBeVisible();
    await cb.check();
    await expect(cb).toBeChecked();

    // Option B: Just click "Pilih Semua" (often easier for bulk processing)
    // const btn = this.locator.getPilihSemuaButton;
    // await expect(btn).toBeVisible();
    // await btn.click();
  }

  async clickSahkanPukal(): Promise<void> {
    const btn = this.locator.getSahkanPukalButton;
    await expect(btn).toBeVisible();
    await btn.click();
  }

  async clickYaSahkan(): Promise<void> {
    const btn = this.locator.getSwalConfirmButton;
    await expect(btn).toBeVisible();
    await btn.click();
  }

    /** Clicks all "Sila Pilih" dropdowns in the table and selects "Lengkap" */
  async selectLengkapForAllDocuments(): Promise<void> {
    const triggers = this.locator.getLengkapDropdownTriggers;

    // Loop as long as there is at least one "Sila Pilih" dropdown remaining
    while (await triggers.count() > 0) {
      // Always interact with the first remaining "Sila Pilih"
      const trigger = triggers.first();
      
      await trigger.scrollIntoViewIfNeeded();
      await trigger.click();
      
      const option = this.page.getByRole('option', { name: 'Lengkap', exact: true });
      await expect(option).toBeVisible();
      await option.click();
      
      // The dropdown we just clicked has now changed to "Lengkap", 
      // so it drops out of the locator list on the next iteration.
    }
  }

  /** Selects "Sokong", fills remarks, and clicks "Hantar" */
  async submitSemakan(catatan: string): Promise<void> {
    const statusSelect = this.locator.getStatusSemakanSelect;
    await expect(statusSelect).toBeVisible();
    await statusSelect.selectOption({ label: 'Sokong' });

    const catatanInput = this.locator.getCatatanTextarea;
    await catatanInput.fill(catatan);

    const hantarBtn = this.locator.getHantarSemakanButton;
    await expect(hantarBtn).toBeEnabled();
    await hantarBtn.click();
  }

  /** Convenience method for the whole review sequence */
  async completeSemakanFlow(catatan: string): Promise<void> {
    await this.fillTarikhJangkaanBayaran();
    await this.checkSemakanCheckbox();
    await this.clickSahkanPukal();
    await this.clickYaSahkan();
    await this.selectLengkapForAllDocuments();
    await this.submitSemakan(catatan);
  }

  /** Clicks the "Semakan" button under the "Tindakan" column for the first row */
  async clickFirstSemakan(): Promise<void> {
    const btn = this.locator.getFirstSemakanButton;
    await expect(btn).toBeVisible();
    await btn.click();
  }

    // ---------- Status Kelulusan (Approval) Flow ----------

  /** Selects "Lulus" (or another option) from the Status Kelulusan dropdown */
  async selectStatusKelulusan(status: 'Lulus' | 'Tidak Lulus' | 'Pindaan'): Promise<void> {
    const select = this.locator.getStatusKelulusanSelect;
    await expect(select).toBeVisible();
    await select.selectOption({ label: status });
  }

  /** Fills the Catatan (remarks) textarea */
  async fillCatatanKelulusan(catatan: string): Promise<void> {
    await this.locator.getCatatanKelulusanInput.fill(catatan);
  }

  /** Clicks the Hantar button (waits for it to enable) */
  async clickHantarKelulusan(): Promise<void> {
    const btn = this.locator.getHantarKelulusanButton;
    // The button is disabled until the select and textarea are filled
    await expect(btn).toBeEnabled(); 
    await btn.click();
  }

  /** Clicks "Ya, Hantar" on the SweetAlert2 confirmation modal */
  async clickYaHantarSwal(): Promise<void> {
    const btn = this.locator.getSwalYaHantarButton;
    await expect(btn).toBeVisible();
    await btn.click();
  }

  /** Convenience method for the whole approval submission */
  async submitKelulusan(status: 'Lulus' | 'Tidak Lulus' | 'Pindaan', catatan: string): Promise<void> {
    await this.selectStatusKelulusan(status);
    await this.fillCatatanKelulusan(catatan);
    await this.clickHantarKelulusan();
    await this.clickYaHantarSwal();
  }


    // ---------- Borang Bulk Processing (Form) ----------

  async fillTajuk(tajuk: string): Promise<void> {
    const input = this.locator.getTajukInput;
    await expect(input).toBeVisible();
    await input.fill(tajuk);
  }

  async selectKategoriAsnaf(label = 'Fakir'): Promise<void> {
    const trigger = this.locator.getKategoriAsnafTrigger;
    await expect(trigger).toBeVisible();
    await trigger.click();

    const option = this.page.getByRole('option', { name: label, exact: true });
    await expect(option).toBeVisible();
    await option.click();
  }

  async fillCatatan(catatan: string): Promise<void> {
    const input = this.locator.getCatatanInput;
    await expect(input).toBeVisible();
    await input.fill(catatan);
  }

  /** Convenience method to fill the form based exactly on the provided screenshot */
  async fillBulkProcessingForm(): Promise<void> {
    await this.fillTajuk('Test 12/11 Bantuan');
    await this.selectKategoriAsnaf('Fakir');
    await this.fillCatatan('Catatan');
  }

    // ---------- Entitlement Product Cards ----------


  async clickEdit(): Promise<void> {
    const btn = this.locator.getEditButton;
    await expect(btn).toBeVisible();
    await btn.click();
  }

  async uploadExcelFile(filePath: string): Promise<void> {
    const btn = this.locator.getPilihFailExcelButton;
    await expect(btn).toBeVisible();

    // 1. Set up the promise to wait for the file chooser dialog to open
    const fileChooserPromise = this.page.waitForEvent('filechooser');

    // 2. Click the button to trigger the dialog
    await btn.click();

    // 3. Wait for the file chooser and set the file
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(path.resolve(filePath));
  }

    // ---------- Bayaran Kepada (Payable To) Modal ----------

  async clickTambahBayaranKepada(): Promise<void> {
    const btn = this.locator.getTambahBayaranKepadaButton;
    await expect(btn).toBeVisible();
    await btn.click();
  }

  /** 
   * Fills the Bayaran Kepada modal.
   * @param ic The identification number
   * @param invoiceDigits The random 3-digit number (e.g., '226')
   */
  async addBayaranKepadaAsnaf(ic: string, invoiceDigits: string): Promise<void> {
    // 1. Select Asnaf
    const bayaranSelect = this.locator.getBayaranKepadaSelect;
    await expect(bayaranSelect).toBeVisible();
    await bayaranSelect.selectOption({ label: 'Asnaf' });

    // 2. Select MyKad / MyKid
    const jenisSelect = this.locator.getJenisPengenalanPaymentSelect;
    await expect(jenisSelect).toBeVisible();
    await jenisSelect.selectOption({ label: 'MyKad / MyKid' });

    // 3. Fill No. Pengenalan
    const icInput = this.locator.getPaymentNoPengenalanInput;
    await expect(icInput).toBeVisible();
    await icInput.fill(ic);

    // 4. Fill Invoice Number (only digits, prefix INV- is already in UI)
    const invoiceInput = this.locator.getNoInvoiceCustomerInput;
    await invoiceInput.fill(invoiceDigits);

    // 5. Click checkbox
    await this.locator.getSalinKeSenaraiPaymentCheckbox.check();

    // 6. Click Tambah
    await this.locator.getTambahPaymentSubmitButton.click();
  }

    // ---------- Tindakan (Action Buttons) ----------

  async clickSimpan(): Promise<void> {
    const btn = this.locator.getSimpanButton;
    await expect(btn).toBeVisible();
    await expect(btn).toBeEnabled();
    await btn.click();
  }

}