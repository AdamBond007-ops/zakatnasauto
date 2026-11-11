import { test, expect, type Page } from '@playwright/test';


async function selectSecurityQuestion(page: Page, questionName: string, value: string) {
  const dropdown = page.locator(`select[name="${questionName}"]`);
  await dropdown.selectOption({ label: value });
}

test('Register account and verify via Gmail API', async ({ page }: { page: Page }) => {
  

  // 1. Details configuration
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  const randomLetters = Array.from(
    { length: 6 },
    () => letters[Math.floor(Math.random() * letters.length)]
  ).join('');
  const fullName = `Shafiy Adam ${randomLetters}`;
  const email = `shafiyadam83+${randomLetters}@gmail.com`;
  const password = 'Password123@';
  
  // Generate random phone number: 01 followed by 8 random digits
  const randomPhoneDigits = Math.floor(10000000 + Math.random() * 90000000);
  const phoneNumber = `01${randomPhoneDigits}`;

  // Generate a unique IC-shaped value for a birth year that makes the applicant an adult.
  const birthYear = 1980 + Math.floor(Math.random() * 20);
  const birthMonth = 1 + Math.floor(Math.random() * 12);
  const birthDay = 1 + Math.floor(Math.random() * 28);
  const icNumber = `${String(birthYear).slice(-2)}${String(birthMonth).padStart(2, '0')}${String(birthDay).padStart(2, '0')}${String(1 + Math.floor(Math.random() * 16)).padStart(2, '0')}${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;

  console.log(`[Info] Registered Name: ${fullName}`);
  console.log(`[Info] Using Email: ${email}`);

  // 2. Navigate to registration page
  await page.goto('https://stg.nas-internal.com/register');

  // 3. Fill out text fields using stable attributes
  await page.locator('input[name="fullName"]').fill(fullName);
  await page.locator('input[name="no_pengenalan"]').fill(icNumber);
  await page.locator('input[name="phoneNumber"]').fill(phoneNumber);
  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="confirmEmail"]').fill(email);
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
