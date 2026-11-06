import { Locator, Page } from "@playwright/test";

export class KelulusanMain {
    constructor(private readonly page: Page) { }

    get menuKelulusan(): Locator {
        return this.page.locator('a[data-menu-path="/profiling/asnaf/kelulusan"]');
    }

    // --- Tabs (button name also contains the count, e.g. "Menunggu Kelulusan 14") ---
    get tabMenungguKelulusan(): Locator {
        return this.page.getByRole("button", { name: /^Menunggu Kelulusan/ });
    }
    get tabSelesai(): Locator {
        return this.page.getByRole("button", { name: /^Selesai/ });
    }
    get tabSemua(): Locator {
        return this.page.getByRole("button", { name: /^Semua/ });
    }

    // --- Table header ---
    get searchInput(): Locator {
        return this.page.getByPlaceholder("Cari...");
    }
    /** "Hasil setiap halaman" dropdown (options: 5, 10, 25, 50, 100). */
    get perPageContainer(): Locator {
        return this.page.locator(".table-header").locator('[data-type="selectSearch"]');
    }
    /** Opened list may render outside the container, so search the page. */
    selectSearchOption(optionText: string): Locator {
        return this.page
            .getByRole("option", { name: optionText, exact: true })
            .or(this.page.getByRole("listbox").getByText(optionText, { exact: true }));
    }

    // --- Table rows (found by No. Pengenalan, which is unique) ---
    get tableRows(): Locator {
        return this.page.locator("tbody tr");
    }
    rowByIc(ic: string): Locator {
        return this.tableRows.filter({ hasText: ic });
    }
    rowByNama(nama: string): Locator {
        return this.tableRows.filter({ hasText: nama });
    }
    lihatKelulusanButton(row: Locator): Locator {
        return row.getByTitle("Lihat Kelulusan");
    }

    // --- Footer / pagination ---
    get footerInfo(): Locator {
        return this.page.locator(".table-footer").getByText(/Menunjukkan .* entri/);
    }
    get halamanSeterusnyaButton(): Locator {
        return this.page.getByRole("button", { name: "Halaman seterusnya" });
    }
    get halamanSebelumnyaButton(): Locator {
        return this.page.getByRole("button", { name: "Halaman sebelumnya" });
    }
    halamanButton(page: number): Locator {
        return this.page.getByRole("button", { name: `Halaman ${page}`, exact: true });
    }
    // --- Detail page: status badge + tabs ---
    get statusBadge(): Locator {
        return this.page.locator(".status-badge");
    }
    /** Tabs: Aduan, Maklumat Pemohon, Tanggungan, Status Asnaf, Bantuan, Pengesahan, Sejarah */
    detailTab(name: string): Locator {
        return this.page.locator(".tab-nav-scroll").getByRole("button", { name, exact: true });
    }

    // --- Tab Bantuan: table of bantuan, found by No Bantuan ---
    bantuanRow(noBantuan: string): Locator {
        return this.page.locator("tbody tr").filter({ hasText: noBantuan });
    }
    bantuanLihatTindakanButton(noBantuan: string): Locator {
        return this.bantuanRow(noBantuan).getByTitle("Lihat / Tindakan");
    }
    bantuanRowByNama(nama: string): Locator {
        const escapedNama = nama.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        return this.page.locator("tbody tr:visible").filter({
            has: this.page.getByText(new RegExp(`^${escapedNama}$`, "i")),
        });
    }
    bantuanLihatTindakanButtonByNama(nama: string): Locator {
        return this.bantuanRowByNama(nama).getByTitle("Lihat / Tindakan");
    }

    // --- Sidebar: Keputusan Kelulusan (found by its hidden <select name="keputusan">) ---
    get keputusanForm(): Locator {
        return this.page
            .locator("form")
            .filter({ has: this.page.locator('select[name="keputusan"]') });
    }
    /** Card header button that collapses / expands the card. */
    get keputusanHeaderButton(): Locator {
        return this.page.getByRole("button", { name: "Keputusan Kelulusan" });
    }
    get keputusanContainer(): Locator {
        return this.keputusanForm
            .locator('[data-type="selectSearch"]')
            .filter({ has: this.page.locator('select[name="keputusan"]') });
    }
    get catatanKelulusanInput(): Locator {
        return this.keputusanForm.getByPlaceholder("Masukkan catatan kelulusan...");
    }
    get hantarButton(): Locator {
        return this.keputusanForm.getByRole("button", { name: "Hantar", exact: true });
    }
    // --- Per-bantuan approval card (opened from "Lihat / Tindakan") ---
    get keputusanBantuanCard(): Locator {
        return this.page.locator(".card").filter({
            has: this.page.getByRole("heading", { name: "Keputusan Kelulusan", level: 3 }),
        });
    }
    get statusKelulusanContainer(): Locator {
        return this.keputusanBantuanCard
            .locator('[data-type="selectSearch"]')
            .filter({ has: this.page.locator("label", { hasText: /^Status Kelulusan\*$/ }) });
    }
    get catatanBantuanInput(): Locator {
        return this.keputusanBantuanCard.getByPlaceholder(
            "Masukkan catatan, dapatan dan pemerhatian semasa kelulusan...",
        );
    }
    /** Read-only line, e.g. "Masa/Tarikh: 5/11/2026, 4:26:14 PTG" */
    get masaTarikhKelulusan(): Locator {
        return this.keputusanBantuanCard.getByText(/^Masa\/Tarikh:/);
    }
}