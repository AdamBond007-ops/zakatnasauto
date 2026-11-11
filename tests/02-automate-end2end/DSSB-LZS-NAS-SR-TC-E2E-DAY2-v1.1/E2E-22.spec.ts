import { expect, test, type Page } from "@playwright/test";
import { faker } from "@faker-js/faker";
import path from "path";
import { AduanAction, type AduanContactDetails, type AduanIndividuDetails } from "@library/2-object/aduan/action";

async function selectSecurityQuestion(page: Page, questionName: string, value: string) {
  const select = page.locator(`select[name="${questionName}"]`);
  const container = page.locator('[data-type="selectSearch"]').filter({ has: select });
  const option = select.locator(`option[value="${value}"]`);
  await expect(option).toHaveCount(1);
  const optionLabel = (await option.textContent())?.trim();
  if (!optionLabel) {
    throw new Error(`Security question option "${value}" was not found.`);
  }

  const trigger = container.locator(".select-trigger");
  await trigger.click();
  const listbox = page.getByRole("listbox").filter({ visible: true }).last();
  await listbox.getByRole("option", { name: optionLabel, exact: true }).click();
  await expect(select).toHaveValue(value);
}

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

function createContactDetails(namaPenuh: string): AduanContactDetails & { emel: string } {
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

  await aduan.clickDaftarAkaun();

  await page.waitForTimeout(3000);

  const password = 'Password123@';

  await page.locator('input[name="fullName"]').fill(pengadu.namaPenuh);
  await page.locator('input[name="no_pengenalan"]').fill(pengadu.noPengenalan);
  await page.locator('input[name="phoneNumber"]').fill(pengadu.noTelefon);
  await page.locator('input[name="email"]').fill(pengadu.emel);
  await page.locator('input[name="confirmEmail"]').fill(pengadu.emel);
  await page.locator('input[name="password"]').fill(password);
  await page.locator('input[name="confirmPassword"]').fill(password);

  // 4. Fill Security Questions
  await selectSecurityQuestion(page, 'securityQuestion1', 'SOALAN_01');
  await page.locator('input[name="securityAnswer1"]').fill('Kucing');

  await selectSecurityQuestion(page, 'securityQuestion2', 'SOALAN_02');
  await page.locator('input[name="securityAnswer2"]').fill('Sekolah Kebangsaan Utama');

  await selectSecurityQuestion(page, 'securityQuestion3', 'SOALAN_03');
  await page.locator('input[name="securityAnswer3"]').fill('Kuala Lumpur');

  // 5. Click PDPA consent checkbox
  await page.locator('#pdpa-consent').check();

  // 6. Submit the form
  await page.locator('button[type="submit"]').click();
  await page.getByRole('button', { name: 'OK', exact: true }).click();


});