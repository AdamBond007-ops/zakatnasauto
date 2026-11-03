import { faker } from "@faker-js/faker";

export const LABELS = {
  tahapKeperluan: "Tahap Keperluan Bantuan",
  consent: /Saya mengesahkan bahawa maklumat yang direkodkan adalah benar/,
} as const;

export const STATUS_PERKAHWINAN = {
  BERKAHWIN: "Berkahwin",
  DUDA: "Duda",
  BALU: "Balu",
  BAPA_TUNGGAL: "Bapa Tunggal",
  BUJANG: "Bujang",
  JANDA: "Janda",
  IBU_TUNGGAL: "Ibu Tunggal",
} as const;

export const TAHAP_KEPERLUAN = {
  KECEMASAN: "Kecemasan",
  MASALAH_KEHIDUPAN: "Masalah Kehidupan",
  DAFTAR_KEMASKINI: "Daftar / Kemaskini / Peningkatan Diri dan Keluarga",
} as const;

/** Sub options only exist under "Kecemasan" (for now). */
export const KECEMASAN_SUB = {
  MAKANAN: "Tiada bekalan makanan mencukupi",
  TEMPAT_TINGGAL: "Tiada tempat tinggal atau rumah tidak selamat",
  KESIHATAN: "Mengalami masalah kesihatan yang kritikal",
  KESELAMATAN: "Menghadapi ancaman keselamatan diri atau keluarga",
} as const;

/** maxlength=11 on the input -> 10 or 11 digits starting with 01. */
export function generatePhoneNumber(): string {
  return "01" + faker.string.numeric(8);
}

export const STATUS_PEKERJAAN = {
    BEKERJA: "1",
    TIDAK_BEKERJA: "0",
  } as const;
  export type StatusPekerjaan = (typeof STATUS_PEKERJAAN)[keyof typeof STATUS_PEKERJAAN];