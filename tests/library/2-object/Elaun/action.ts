import { ElaunTahunanLocators } from './main';

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export class ElaunTahunanActions {
  readonly locators: ElaunTahunanLocators;

  constructor(locators: ElaunTahunanLocators) {
    this.locators = locators;
  }

  private async selectDropdownValue(trigger: import('@playwright/test').Locator, optionText: string): Promise<void> {
    await trigger.click();
    const option = this.locators.page.getByRole('option', { name: new RegExp(`^${escapeRegExp(optionText)}$`, 'i') });
    await option.waitFor({ state: 'visible', timeout: 15_000 });
    await option.click();
  }

  /**
   * Switches the active role to EKSEKUTIF_PA from the top header dropdown
   */
  async switchRoleToEksekutifPA(): Promise<void> {
    await this.locators.tukarPerananDropdownButton.click();
    await this.locators.eksekutifPaRoleOption.click();
  }

  /**
   * Switches the active role to KJPPA from the top header dropdown
   */
  async switchRoleToKJPPA(): Promise<void> {
    await this.locators.tukarPerananDropdownButton.click();
    await this.locators.kjppaRoleOption.click();
  }

  /**
   * Navigates to Elaun Tahunan via Pengurusan Elaun menu
   */
  async navigateToElaunTahunan(): Promise<void> {
    await this.locators.pengurusanElaunMenu.click();
    await this.locators.elaunTahunanSubMenu.click();
    await this.locators.tambahButton.click();
  }

  async navigateToElaunTahunanKJ(): Promise<void> {
    await this.locators.pengurusanElaunMenu.click();
    await this.locators.elaunTahunanSubMenu.click();
  }

  /**
   * Fills search filters using exact text labels instead of numeric values
   */
  async searchFiltersByLabel(params: {
    tahun?: string;
    daerah?: string;
    kariah?: string;
    kategori?: string;
    jawatan?: string;
    elaun?: string;
  }): Promise<void> {
    if (params.tahun) {
      await this.selectDropdownValue(this.locators.tahunTrigger, params.tahun);
    }

    if (params.daerah) {
      await this.selectDropdownValue(this.locators.daerahTrigger, params.daerah);
    }

    if (params.kariah) {
      await this.selectDropdownValue(this.locators.kariahTrigger, params.kariah);
    }

    if (params.kategori) {
      await this.selectDropdownValue(this.locators.kategoriTrigger, params.kategori);
    }

    if (params.jawatan) {
      await this.selectDropdownValue(this.locators.jawatanTrigger, params.jawatan);
    }

    if (params.elaun) {
      await this.selectDropdownValue(this.locators.elaunTrigger, params.elaun);
    }

    await this.locators.cariButton.click();
  }

  /**
   * Selects the record checkbox in the table and clicks "Pilih"
   */
  async selectRecordAndConfirm(): Promise<void> {
    await this.locators.recordCheckbox.check();
    await this.locators.pilihModalButton.click();
  }

  /**
   * Fills remarks (catatan), uploads a supporting document, and submits (Hantar)
   */
  async submitElaunForm(catatanText: string, filePath: string): Promise<void> {
    await this.locators.catatanTextarea.fill(catatanText);
    await this.locators.uploadFileInput.setInputFiles(filePath);
    await this.locators.hantarButton.click();
  }

  /**
 * Selects the record, triggers Kelulusan Pukal, fills approval decision + notes, and confirms.
 */
async processBulkApproval(
  catatanText: string = "Diluluskan",
  keputusan: string = "Lulus"
): Promise<void> {
  // 1. Click Checkbox
  await this.locators.tableRecordCheckbox.check();

  // 2. Click Kelulusan Pukal
  await this.locators.kelulusanPukalButton.click();

  // 3. Select Keputusan (Default: Lulus)
  await this.locators.keputusanTrigger.click();
  await this.locators.keputusanDropdown.selectOption({ label: keputusan });

  // 4. Fill Catatan
  await this.locators.bulkCatatanTextarea.fill(catatanText);

  // 5. Click Hantar
  await this.locators.bulkHantarButton.click();

  // 6. Confirm batch approval
  await this.locators.modalApproveButton.click();
}
}