import { Locator, Page } from '@playwright/test';

export class PendaftaranPantasPukalLocator {
  constructor(private readonly page: Page) {}

  /** Sidebar/menu button: "Pendaftaran Pantas Pukal" */
  get getPendaftaranPantasPukalButton(): Locator {
    return this.page.getByRole('button', { name: 'Pendaftaran Pantas Pukal' });
  }

  /** Sub-menu link: "Bantuan Pantas" */
  get getBantuanPantasMenu(): Locator {
    return this.page.locator(
      'a[data-menu-path="/profiling/asnaf/pendaftaran-pantas-pukal"]'
    );
  }

  /** Alternative (CSS) if the link role is not reliable */
  get getBantuanPantasMenuByPath(): Locator {
    return this.page.locator(
      'a[data-menu-path="/profiling/asnaf/pendaftaran-pantas-pukal"]'
    );
  }

  /** First "Permohonan pukal" action button in the table */
  get getPermohonanPukalButton(): Locator {
    return this.page.getByTitle('Permohonan pukal').first();
  }

  /** "Permohonan pukal" button scoped to a row containing given text */
  getPermohonanPukalButtonInRow(rowText: string | RegExp): Locator {
    return this.page
      .locator('tr')
      .filter({ hasText: rowText })
      .getByTitle('Permohonan pukal');
  }

  /** Primary button: "Mohon Bantuan" */
  get getMohonBantuanButton(): Locator {
    return this.page.getByRole('button', { name: 'Mohon Bantuan' });
  }

  /** Modal/card button: "Individu" (exact to avoid partial matches) */
  get getIndividuButton(): Locator {
    return this.page.getByRole('button', { name: 'Individu', exact: true });
  }

  /** Optional: "Pukal" button in the same card, for future use */
  get getPukalButton(): Locator {
    return this.page.getByRole('button', { name: 'Pukal', exact: true });
  }

    // ---------- Maklumat Peribadi (IC lookup) ----------

    /** Wrapper that owns the Jenis Pengenalan selectSearch */
  private get jenisPengenalanWrapper(): Locator {
    return this.page
      .locator('.formkit-outer')
      .filter({ has: this.page.locator('select[name="kodJenisPengenalan"]') });
  }

  /** Visible trigger (the thing a user clicks) */
  get getJenisPengenalanTrigger(): Locator {
    return this.jenisPengenalanWrapper.locator('.select-trigger');
  }

  /** Text shown inside the trigger after a selection */
  get getJenisPengenalanSelectedValue(): Locator {
    return this.getJenisPengenalanTrigger.locator('.selected-value');
  }

  /** No. Pengenalan input */
  get getNoPengenalanInput(): Locator {
    return this.page.locator('input[name="noPengenalan"]');
  }

  /** "Cari" button next to No. Pengenalan */
  get getCariButton(): Locator {
    return this.page.getByRole('button', { name: 'Cari', exact: true });
  }

    // ---------- Add-to-list / assign bantuan ----------

  /** Footer button: "Tambah ke Senarai" (submit) */
  get getTambahKeSenaraiButton(): Locator {
    return this.page.getByRole('button', { name: 'Tambah ke Senarai' });
  }

  /** Card wrapper for a "Tetapkan Bantuan Mengikut Kategori Asnaf" entry */
  get getKategoriCard(): Locator {
    return this.page.locator(
      'div.bg-white.rounded-lg.border.border-blue-100.p-3'
    );
  }

  /**
   * "Tetapkan bantuan" button for the card whose kategori matches `kategori`.
   * Uses ^kategori + " ·" so 'Fakir' does NOT also match 'Non Fakir/Miskin'.
   */
  getTetapkanBantuanButtonForKategori(kategori: string): Locator {
    const kategoriText = new RegExp(`^${kategori}\\s*·`);
    return this.getKategoriCard
      .filter({ has: this.page.getByText(kategoriText) })
      .getByRole('button', { name: /Tetapkan bantuan/ });
  }

    // ---------- Maklumat Bantuan (Aid cascade) ----------

  // Use regex to avoid "Aid" matching "Aid Product"
  get getAidSelect(): Locator {
    return this.page.getByLabel(/^Aid(\*)?$/);
  }
  get getAidTrigger(): Locator {
    return this.getAidSelect.locator('..').locator('.select-trigger');
  }

  get getAidProductSelect(): Locator {
    return this.page.getByLabel(/^Aid Product(\*)?$/);
  }
  get getAidProductTrigger(): Locator {
    return this.getAidProductSelect.locator('..').locator('.select-trigger');
  }

  get getProductPackageSelect(): Locator {
    return this.page.getByLabel(/^Product Package(\*)?$/);
  }
  get getProductPackageTrigger(): Locator {
    return this.getProductPackageSelect.locator('..').locator('.select-trigger');
  }

  get getEntitlementProductSelectE2E01(): Locator {
    return this.page.getByLabel(/^Entitlement Product(\*)?$/);
  }

  get getEntitlementProductTriggerE2E01(): Locator {
    return this.getEntitlementProductSelectE2E01.locator('..').locator('.select-trigger');
  }

  get getEntitlementProductSelectE2E04(): Locator {
    return this.page.locator('select[name="produkEntitlement"]');
  }

  get getEntitlementProductTriggerE2E04(): Locator {
    return this.page
      .locator('.formkit-outer')
      .filter({ has: this.getEntitlementProductSelectE2E04 })
      .locator('.select-trigger');
  }

  get getAmaunBantuanInput(): Locator {
    return this.page.locator('input[name="amaunBantuan"]');
  }

    // ---------- Senarai Pemohon (selection + submit) ----------

    /** Applicant checkboxes only — header "select all" lives in <thead>. */
  get getApplicantCheckboxes(): Locator {
    return this.page.locator('tbody tr').getByRole('checkbox');
  }

  /** Nth applicant row (0-based). */
  getApplicantCheckboxAt(index: number): Locator {
    return this.page.locator('tbody tr').nth(index).getByRole('checkbox');
  }

  /** "Hantar (n)" button */
  get getHantarButton(): Locator {
    return this.page.getByRole('button', { name: /^Hantar\b/ });
  }


    // ---------- Dokumen Sokongan (upload per row) ----------

  /**
   * A document row. Scoped to a grid that actually contains a file input, so it
   * cannot accidentally match the header row or other grids.
   * `name` is the visible document text (string for substring, RegExp for control).
   */
  getDocumentRow(name: string | RegExp): Locator {
    return this.page
      .locator('div.grid.items-start:has(input[type="file"])')
      .filter({ hasText: name })
      .first();
  }

  /** Hidden <input type="file"> for a given document row. */
  getDocumentFileInput(name: string | RegExp): Locator {
    return this.getDocumentRow(name).locator('input[type="file"]');
  }

  /** Optional: the catatan/remarks textarea on that row. */
  getDocumentCatatan(name: string | RegExp): Locator {
    return this.getDocumentRow(name).locator('textarea');
  }

  /** Parent button: "Bulk Processing" */
  get getBulkProcessingButton(): Locator {
    return this.page.getByRole('button', { name: 'Bulk Processing' });
  }

  /** Sub-menu link: "Cipta Bulk Processing" */
  get getCiptaBulkProcessingMenu(): Locator {
    return this.page.locator(
      'a[data-menu-path="/pengurusan-bantuan/bulk-processing/form"]'
    );
  }

  /** Sub-menu link: "Senarai Bulk Processing" (using data-menu-path) */
  get getSenaraiBulkProcessingMenu(): Locator {
    return this.page.locator(
      'a[data-menu-path="/pengurusan-bantuan/bulk-processing"]'
    );
  }

    // ---------- Table Actions (Semakan) ----------

  /** General locator for the "Semakan" button */
  // In main.ts
get getSemakanButton(): Locator {
  // .first() resolves the strict mode violation
  return this.page.getByRole('button', { name: 'Semakan', exact: true }).first();
}

  /** 
   * Scoped locator: finds the "Semakan" button inside a specific table row.
   * @param index 0-based row index.
   */
  getSemakanButtonInRow(index: number): Locator {
    return this.page.locator('tbody tr').nth(index).getByRole('button', { name: 'Semakan', exact: true });
  }

    // ---------- Semakan (Review) Flow ----------

  get getTarikhJangkaanBayaranInput(): Locator {
    return this.page.locator('input[name="eoadTarikhJangkaanBayaran"]');
  }

  get getTarikhJangkaanBayaranInputNonEOAD(): Locator {
    return this.page.locator('input[name="tarikhJangkaanBayaran"]');
  }

    get getSemakanCheckbox(): Locator {
    // 1. Find the specific table that has a "Pilih" column header
    const beneficiaryTable = this.page.locator('table').filter({
      has: this.page.getByRole('columnheader', { name: 'Pilih', exact: true })
    });

    // 2. Get the first row's checkbox in that specific table
    return beneficiaryTable.locator('tbody tr').first().getByRole('checkbox');
  }

    get getPilihSemuaButton(): Locator {
    return this.page.getByRole('button', { name: 'Pilih Semua' });
  }


  get getSahkanPukalButton(): Locator {
    return this.page.getByRole('button', { name: 'Sahkan Pukal' });
  }

  get getSwalConfirmButton(): Locator {
    // SweetAlert2 confirm button
    return this.page.locator('.swal2-confirm');
  }

  /** Finds all "Sila Pilih" triggers in the table to select "Lengkap" */
  get getLengkapDropdownTriggers(): Locator {
    return this.page.locator('td .formkit-select-search .select-trigger', { hasText: 'Sila Pilih' });
  }

  get getStatusSemakanSelect(): Locator {
    return this.page.locator('select').filter({ hasText: '-- Pilih Tindakan --' });
  }

  get getCatatanTextarea(): Locator {
    return this.page.getByPlaceholder('Masukkan catatan...');
  }

  get getHantarSemakanButton(): Locator {
    // Scoped to the side panel to avoid clicking the bottom "Hantar" button
    return this.page.locator('.card-body').getByRole('button', { name: 'Hantar', exact: true });
  }

    // ---------- Table Actions (Semakan) ----------

  /** 
   * Scoped locator: Finds the "Semakan" button in the last column (Tindakan) 
   * of the very first row.
   */
  get getFirstSemakanButton(): Locator {
    return this.page
      .locator('tbody tr')
      .first()
      .locator('td')
      .last() // Targets the "Tindakan" column
      .getByRole('button', { name: 'Semakan', exact: true });
  }

    // ---------- Status Kelulusan (Approval) Flow ----------

  /** The native <select> for Status Kelulusan */
    get getStatusKelulusanSelect(): Locator {
    return this.page
      .locator('div')
      .filter({ hasText: 'Status Kelulusan' })
      // .last() ensures we grab the innermost div, not a giant page wrapper
      .last() 
      .locator('select');
  }

  /** The Catatan textarea */
  get getCatatanKelulusanInput(): Locator {
    return this.page.getByPlaceholder('Masukkan catatan...');
  }

  /** The Hantar button in the approval card (starts disabled) */
  get getHantarKelulusanButton(): Locator {
    // Scoping to the card body avoids grabbing other "Hantar" buttons elsewhere
    return this.page.locator('.card-body').getByRole('button', { name: 'Hantar', exact: true });
  }

  /** The "Ya, Hantar" button inside the SweetAlert2 popup */
  get getSwalYaHantarButton(): Locator {
    return this.page.getByRole('button', { name: 'Ya, Hantar', exact: true });
  }

    // ---------- Borang Bulk Processing (Form) ----------

  get getTajukInput(): Locator {
    return this.page.locator('input[name="tajuk"]');
  }

  get getKategoriAsnafTrigger(): Locator {
    // Targets the visible dropdown trigger for Kategori Asnaf
    return this.page.locator('select[name="kategoriAsnaf"]').locator('..').locator('.select-trigger');
  }

  get getCatatanInput(): Locator {
    return this.page.locator('textarea[name="catatan"]');
  }

    // ---------- Entitlement Product Cards ----------


  get getEditButton(): Locator {
    return this.page.getByRole('button', { name: 'Edit', exact: true });
  }

    // ---------- Excel Upload ----------

  get getPilihFailExcelButton(): Locator {
    return this.page.getByRole('button', { name: 'Pilih Fail Excel' });
  }

    // ---------- Bayaran Kepada (Payable To) Modal ----------

  get getTambahBayaranKepadaButton(): Locator {
    return this.page.getByRole('button', { name: 'Tambah Bayaran Kepada' });
  }

    // ---------- Bayaran Kepada (Payable To) Modal ----------

  /** The first dropdown (Asnaf / Organisasi / Recipient) */
  get getBayaranKepadaSelect(): Locator {
    return this.page
      .locator('select')
      .filter({ 
        has: this.page.getByRole('option', { name: '-- Pilih Bayaran Kepada --', exact: true }) 
      });
  }

  /** The second dropdown (Jenis Pengenalan) */
  get getJenisPengenalanPaymentSelect(): Locator {
    return this.page
      .locator('select')
      .filter({ 
        has: this.page.getByRole('option', { name: '-- Pilih Jenis Pengenalan --', exact: true }) 
      });
  }

  get getPaymentNoPengenalanInput(): Locator {
    return this.page.locator('input[name="paymentNoPengenalan"]');
  }

  get getNoInvoiceCustomerInput(): Locator {
    return this.page.getByPlaceholder('contoh: 226');
  }

  get getSalinKeSenaraiPaymentCheckbox(): Locator {
    return this.page.getByRole('checkbox', { name: /Salin ke Senarai Penerima/ });
  }

  get getTambahPaymentSubmitButton(): Locator {
    // Scoped to modal-footer to avoid clicking the other "Tambah" buttons
    return this.page.locator('.modal-footer').getByRole('button', { name: 'Tambah', exact: true });
  }

    // ---------- Tindakan (Action Buttons) ----------

  get getSimpanButton(): Locator {
    // Scoping to .card-body to ensure we target the sidebar action button
    return this.page.locator('.card-body').getByRole('button', { name: 'Simpan', exact: true });
  }
  
}