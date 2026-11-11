import { Page, Locator } from '@playwright/test';

export class ElaunTahunanLocators {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // --- Role & Navigation ---
  get tukarPerananDropdownButton(): Locator {
    return this.page.locator('button[data-tooltip="Tukar Peranan"]');
  }

  get eksekutifPaRoleOption(): Locator {
    return this.page.getByRole('menuitem', { name: /eksekutif_pa/i });
  }

  get kjppaRoleOption(): Locator {
    return this.page.getByRole('menuitem', { name: 'KJPPA', exact: true });
  }

  get pengurusanElaunMenu(): Locator {
    return this.page.locator('button', { hasText: 'Pengurusan Elaun' });
  }

  get elaunTahunanSubMenu(): Locator {
    return this.page.locator('a[data-menu-path="/penolong-amil/pengurusan-elaun/tahunan"]');
  }

  get tambahButton(): Locator {
    return this.page.locator('button', { hasText: 'Tambah' });
  }

  // --- Search Form Selectors & Triggers ---
  get tahunDropdown(): Locator {
    return this.page.locator('select[name="selectSearch_1"]');
  }
  get tahunTrigger(): Locator {
    return this.tahunDropdown.locator('xpath=..').locator('.select-trigger');
  }

  get daerahDropdown(): Locator {
    return this.page.locator('select[name="selectSearch_2"]');
  }
  get daerahTrigger(): Locator {
    return this.daerahDropdown.locator('xpath=..').locator('.select-trigger');
  }

  get kariahDropdown(): Locator {
    return this.page.locator('select[name="selectSearch_3"]');
  }
  get kariahTrigger(): Locator {
    return this.kariahDropdown.locator('xpath=..').locator('.select-trigger');
  }

  get kategoriDropdown(): Locator {
    return this.page.locator('select[name="selectSearch_4"]');
  }
  get kategoriTrigger(): Locator {
    return this.kategoriDropdown.locator('xpath=..').locator('.select-trigger');
  }

  get jawatanDropdown(): Locator {
    return this.page.locator('select[name="selectSearch_5"]');
  }
  get jawatanTrigger(): Locator {
    return this.jawatanDropdown.locator('xpath=..').locator('.select-trigger');
  }

  get elaunDropdown(): Locator {
    return this.page.locator('select[name="selectSearch_6"]');
  }
  get elaunTrigger(): Locator {
    return this.elaunDropdown.locator('xpath=..').locator('.select-trigger');
  }

  get cariButton(): Locator {
    return this.page.locator('button', { hasText: 'Cari' });
  }

  // --- Modal Selection ---
  get recordCheckbox(): Locator {
    return this.page.locator('input[type="checkbox"][name^="pilih-pa-"]');
  }

  get pilihModalButton(): Locator {
    return this.page.locator('.modal-footer button', { hasText: 'Pilih' });
  }

  // --- Form Filling (Catatan, Upload, Hantar) ---
  get catatanTextarea(): Locator {
    return this.page.locator('textarea[name="textarea_7"]');
  }

  get uploadFileInput(): Locator {
    return this.page.locator('input[type="file"][name="dokumen_sokongan"], input[type="file"]').first();
  }

  get hantarButton(): Locator {
    return this.page.locator('button', { hasText: 'Hantar' });
  }


  //kj lulus

  // Checkbox for record selection
get tableRecordCheckbox(): Locator {
  return this.page.locator('input[type="checkbox"][name^="pilih-"]');
}

// Bulk Approval Button
get kelulusanPukalButton(): Locator {
  return this.page.locator('button', { hasText: 'Kelulusan Pukal' });
}

// Keputusan Dropdown
get keputusanDropdown(): Locator {
  return this.page.locator('select[name="selectSearch_3"]');
}

get keputusanTrigger(): Locator {
  return this.keputusanDropdown.locator('xpath=..').locator('.select-trigger');
}

// Catatan Field
get bulkCatatanTextarea(): Locator {
  return this.page.locator('textarea[name="textarea_4"]');
}

// Hantar Button
get bulkHantarButton(): Locator {
  return this.page.locator('button', { hasText: 'Hantar' });
}

// SweetAlert confirmation for approving the selected batch
get modalApproveButton(): Locator {
  return this.page.getByRole('button', { name: 'Ya, Luluskan', exact: true });
}
}