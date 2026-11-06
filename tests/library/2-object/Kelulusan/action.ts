import { expect, Locator, Page } from "@playwright/test";
import { KelulusanMain } from "@library/2-object/Kelulusan/main";

export class KelulusanAction {
    private readonly main: KelulusanMain;

    constructor(private readonly page: Page) {
        this.main = new KelulusanMain(page);
    }

    async goToKelulusan(): Promise<void> {
        await this.main.menuKelulusan.click();
        await expect(this.main.searchInput).toBeVisible();
    }

    private async selectFromDropdown(container: Locator, optionText: string): Promise<void> {
        const trigger = container.locator(".select-trigger");

        await trigger.scrollIntoViewIfNeeded();
        await trigger.click();

        try {
            await this.main.selectSearchOption(optionText).first().click({ timeout: 5_000 });
        } catch {
            await container.locator("select").selectOption({ label: optionText }, { force: true });
        }

        await expect(trigger).toContainText(optionText);
    }

    // --- Tabs ---
    async clickTabMenungguKelulusan(): Promise<void> {
        await this.main.tabMenungguKelulusan.click();
    }

    async clickTabSelesai(): Promise<void> {
        await this.main.tabSelesai.click();
    }

    async clickTabSemua(): Promise<void> {
        await this.main.tabSemua.click();
    }

    // --- Search ---
    async fillCari(value: string): Promise<void> {
        await this.main.searchInput.fill(value);
        await expect(this.main.searchInput).toHaveValue(value);
    }

    /** Searches by IC and waits for that row to show up. */
    async cariByIc(ic: string): Promise<void> {
        await this.fillCari(ic);
        await expect(this.main.rowByIc(ic)).toHaveCount(1);
    }

    async clearCari(): Promise<void> {
        await this.main.searchInput.clear();
    }

    // --- Table ---
    async selectHasilSetiapHalaman(option: "5" | "10" | "25" | "50" | "100"): Promise<void> {
        await this.selectFromDropdown(this.main.perPageContainer, option);
    }

    async expectRowVisible(ic: string): Promise<void> {
        await expect(this.main.rowByIc(ic)).toBeVisible();
    }

    async expectRowStatus(ic: string, status: string): Promise<void> {
        await expect(this.main.rowByIc(ic).getByText(status, { exact: true })).toBeVisible();
    }

    async clickLihatKelulusan(ic: string): Promise<void> {
        const button = this.main.lihatKelulusanButton(this.main.rowByIc(ic));
        await expect(button).toBeVisible();
        await button.click();
    }

    // --- Pagination ---
    async clickHalamanSeterusnya(): Promise<void> {
        await this.main.halamanSeterusnyaButton.click();
    }

    async clickHalamanSebelumnya(): Promise<void> {
        await this.main.halamanSebelumnyaButton.click();
    }

    async clickHalaman(page: number): Promise<void> {
        await this.main.halamanButton(page).click();
    }

    // --- Detail page ---
    async expectStatus(status: string): Promise<void> {
        await expect(this.main.statusBadge).toHaveText(status);
    }

    async clickDetailTab(name: string): Promise<void> {
        await this.main.detailTab(name).click();
    }

    async clickLihatTindakanBantuan(noBantuan: string): Promise<void> {
        const button = this.main.bantuanLihatTindakanButton(noBantuan);
        await expect(button).toBeVisible();
        await button.click();
    }

    async clickLihatTindakanBantuanByNama(nama: string): Promise<void> {
        const row = this.main.bantuanRowByNama(nama);
        await expect(row).toHaveCount(1);
        const button = row.getByTitle("Lihat / Tindakan");
        await expect(button).toBeVisible();
        await button.scrollIntoViewIfNeeded();
        await button.click();
    }

    // --- Keputusan Kelulusan ---
    /** Expands the card if it was collapsed. */
    async openKeputusanKelulusan(): Promise<void> {
        if (!(await this.main.keputusanForm.isVisible())) {
            await this.main.keputusanHeaderButton.click();
        }
        await expect(this.main.keputusanForm).toBeVisible();
    }

    /** Options: "Lulus", "Pindaan" */
    async selectKeputusan(option: "Lulus" | "Pindaan"): Promise<void> {
        await this.selectFromDropdown(this.main.keputusanContainer, option);
    }

    async fillCatatanKelulusan(value: string): Promise<void> {
        await this.main.catatanKelulusanInput.fill(value);
        await expect(this.main.catatanKelulusanInput).toHaveValue(value);
    }

    async clickHantar(): Promise<void> {
        // Disabled until Keputusan and Catatan are both filled
        await expect(this.main.hantarButton).toBeEnabled();
        await this.main.hantarButton.click();
    }

    /** Only option right now is "Lulus". */
    async selectStatusKelulusan(option: string): Promise<void> {
        await expect(this.main.keputusanBantuanCard).toBeVisible();
        await this.selectFromDropdown(this.main.statusKelulusanContainer, option);
    }

    async fillCatatanBantuan(value: string): Promise<void> {
        await this.main.catatanBantuanInput.fill(value);
        await expect(this.main.catatanBantuanInput).toHaveValue(value);
    }

    /** Timestamp is set by the system, so only check that it is shown. */
    async expectMasaTarikhKelulusan(): Promise<void> {
        await expect(this.main.masaTarikhKelulusan).toBeVisible();
    }
}