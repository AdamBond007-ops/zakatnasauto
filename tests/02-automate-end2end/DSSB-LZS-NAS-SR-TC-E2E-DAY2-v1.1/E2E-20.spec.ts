import { expect, test } from "@playwright/test";
import { faker } from "@faker-js/faker";
import path from "path";
import { AduanAction, type AduanContactDetails, type AduanIndividuDetails } from "@library/2-object/aduan/action";

const ADUAN_URL = "https://stg.nas-internal.com/public/daftar-aduan";
const TESTING_PDF = path.resolve(__dirname, "../../library/1-data/files/testing.pdf");

function generateMalaysianIc(): string {
  const birthDate = faker.date.birthdate({ min: 18, max: 70, mode: "age" });
  const datePart = `${String(birthDate.getFullYear()).slice(-2)}${String(birthDate.getMonth() + 1).padStart(2, "0")}${String(birthDate.getDate()).padStart(2, "0")}`;
  const stateCode = String(faker.number.int({ min: 1, max: 16 })).padStart(2, "0");
  const serialNumber = `${faker.string.numeric(3)}${faker.helpers.arrayElement(["1", "3", "5", "7", "9"])}`;
  return `${datePart}${stateCode}${serialNumber}`;
}

function generateMalaysianPhoneNumber(): string {
  const prefix = faker.helpers.arrayElement(["010", "011", "012", "013", "014", "016", "017", "018", "019"]);
  return `${prefix}${faker.string.numeric(prefix === "011" ? 8 : 7)}`;
}

function generateEmail(): string {
  const randomWord = faker.word.sample().toLowerCase().replace(/[^a-z]/g, "");
  const randomNumber = faker.string.numeric(4);
  return `shafiyadam83+${randomWord}${randomNumber}@gmail.com`;
}

function createContactDetails(namaPenuh: string): AduanContactDetails {
  return {
    namaPenuh,
    jenisPengenalan: "MyKad / MyKid",
    noPengenalan: generateMalaysianIc(),
    emel: generateEmail(),
    noTelefon: generateMalaysianPhoneNumber(),
  };
}

test("E2E-20 - Daftar aduan sebagai wakil", async ({ page }) => {
  const aduan = new AduanAction(page);
  const pengadu = createContactDetails(faker.person.fullName());
  const individu: AduanIndividuDetails = {
    ...createContactDetails(faker.person.fullName()),
    statusPerkahwinan: "Bujang",
    alamat1: "12",
    alamat2: "Jalan Anggerik 3",
    alamat3: "Subang Jaya",
    poskod: "46200",
    kariah: "MASJID ABU BAKAR AS-SIDDIQ SUBANG JAYA",
  };

  await page.goto(ADUAN_URL);
  await expect(page.getByRole("heading", { name: "Daftar Aduan" })).toBeVisible();

  await aduan.daftarSebagaiPengaduWakil();
  await aduan.fillMaklumatPengadu(pengadu);
  await aduan.fillMaklumatIndividu(individu);
  await aduan.selectTahapKeperluan(
    "Masalah Kehidupan",
    "Kehilangan pekerjaan, sumber pendapatan atau pendapatan tidak mencukupi"
  );
  await aduan.fillPernyataanMasalah("Memerlukan bantuan kecemasan.");
  await aduan.uploadLampiran(TESTING_PDF);
  await aduan.setConsent(true);
  await aduan.clickHantar();

  await page.waitForTimeout(10000);
});