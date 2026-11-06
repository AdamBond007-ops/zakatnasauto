import { Locator, Page } from "@playwright/test";

export class KemaskiniUMain {
  constructor(private readonly page: Page) {}

  get menuCarianAsnaf(): Locator {
    return this.page.locator("a").filter({ hasText: "Carian Asnaf" });
  }

  get noPengenalanInput(): Locator {
    return this.page.getByRole("textbox", { name: "No. Pengenalan" });
  }

  get cariButton(): Locator {
    return this.page.getByRole("button", { name: "Cari", exact: true });
  }

  rowByIc(ic: string): Locator {
    return this.page.locator("tbody tr:visible").filter({
      has: this.page.getByText(ic, { exact: true }),
    });
  }

  lihatProfilButton(row: Locator): Locator {
    return row.getByTitle("Lihat Profil");
  }

  get kemaskiniButton(): Locator {
    return this.page.getByRole("button", { name: "Kemaskini", exact: true });
  }

  get confirmKemaskiniButton(): Locator {
    return this.page.getByRole("button", { name: "Ya, Kemaskini", exact: true });
  }

  get maklumatPemohonTab(): Locator {
    return this.page.getByRole("button", { name: "Maklumat Pemohon", exact: true });
  }

  get tahapDaftarKemaskiniRadio(): Locator {
    return this.page.getByRole("radio", {
      name: "Daftar / Kemaskini / Peningkatan Diri dan Keluarga",
      exact: false,
    });
  }

  get pendaftaranBaharuPerubahanMaklumatRadio(): Locator {
    return this.page.getByRole("radio", {
      name: "Pendaftaran baharu atau perubahan maklumat diri dan isi rumah",
      exact: true,
    });
  }

  get pernyataanMasalahInput(): Locator {
    return this.page.locator('textarea[name="masalah.pernyataan_masalah"]');
  }

  get aduanLampiranUpload(): Locator {
    return this.page
      .locator(".custom-file-upload")
      .filter({ has: this.page.locator('input[name="masalah.lampiran_files"]') });
  }

  get aduanLampiranFileInput(): Locator {
    return this.aduanLampiranUpload.locator('input[type="file"]').first();
  }

  get aduanLampiranPilihFailButton(): Locator {
    return this.aduanLampiranUpload.getByRole("button", { name: "Pilih Fail" });
  }

  get aduanLampiranValue(): Locator {
    return this.aduanLampiranUpload.locator('input[name="masalah.lampiran_files"]');
  }

  get tempatLahirInput(): Locator {
    return this.page.locator('input[data-field="tempat_lahir"]');
  }

  get tiadaTandatanganRadio(): Locator {
    return this.page.locator('input[type="radio"][value="tiada"]');
  }

  get catatanInput(): Locator {
    return this.page.getByPlaceholder("Masukkan catatan sokongan...", { exact: true });
  }
}