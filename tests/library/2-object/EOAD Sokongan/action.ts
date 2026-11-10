import { expect, Page } from "@playwright/test";
import { EoadSokonganMain } from "@library/2-object/EOAD Sokongan/main";

export class EoadSokonganAction {
  private readonly main: EoadSokonganMain;

  constructor(private readonly page: Page) {
    this.main = new EoadSokonganMain(page);
  }

  async completeSupport(applicantName: string): Promise<void> {
    await this.main.menuSokongan.click();
    await expect(this.main.searchInput).toBeVisible();
    await this.main.searchInput.fill(applicantName);
    await expect(this.main.searchInput).toHaveValue(applicantName);
    await this.main.lihatSokonganButton.click();

    await this.main.bantuanTab.click();
    await this.main.lihatKemaskiniButton.click();
    const statusTrigger = this.main.statusSiasatanContainer.locator(".select-trigger");
    await expect(statusTrigger).toBeVisible();
    await statusTrigger.click();
    await this.main.selectSearchOption("Sokong").first().click();
    await expect(statusTrigger).toContainText("Sokong");
    await this.main.catatanSiasatanInput.fill("sokong");
    await this.main.simpanButton.click();

    await this.selectKeputusan("SOKONG");
    await this.main.catatanSokonganInput.fill("sokong");
    await this.main.hantarButton.click();
    await this.main.yaHantarButton.click();
    await this.page.waitForTimeout(3000);
    await expect(this.main.okButton).toBeVisible();
    await this.main.okButton.click();
    
  }

  private async selectKeputusan(value: "SOKONG" | "BATAL"): Promise<void> {
    const optionLabel = await this.main.keputusanSelect
      .locator(`option[value="${value}"]`)
      .textContent();
    if (!optionLabel) {
      throw new Error(`No keputusan option found for value "${value}"`);
    }

    await this.main.keputusanSelect.locator("..").locator(".select-trigger").click();
    const escapedLabel = optionLabel.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const option = this.page
      .locator("span:visible")
      .filter({ hasText: new RegExp(`^${escapedLabel}$`) })
      .last();
    await expect(option).toBeVisible();
    await option.click();
    await expect(this.main.keputusanSelect).toHaveValue(value);
  }

}
