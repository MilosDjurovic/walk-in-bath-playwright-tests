import { expect, test } from '../fixtures/test';
import { zipCodes } from '../fixtures/formData';

test.describe('ZIP code step', () => {
  const invalidZipCodes = [zipCodes.invalidTooShort, zipCodes.invalidTooLong, zipCodes.invalidNonDigit];

  test('requires a ZIP code before allowing users to continue', async ({ landingFormPage }) => {
    await landingFormPage.submitZipCode();

    await expect(landingFormPage.zipValidationMessage()).toContainText('Enter your ZIP code.');
    await expect(landingFormPage.zipStepSubmitButton()).toBeVisible();
    await expect(landingFormPage.interestStepSubmitButton()).toBeHidden();
  });

  invalidZipCodes.forEach((invalidZipCode) => {
    test(`rejects invalid ZIP code: ${invalidZipCode}`, async ({ landingFormPage }) => {
      await landingFormPage.fillZipCode(invalidZipCode);
      await landingFormPage.submitZipCode();

      await expect(landingFormPage.zipValidationMessage()).toHaveText(/Enter your ZIP code\.|Wrong ZIP code\./);
      await expect(landingFormPage.zipStepSubmitButton()).toBeVisible();
      await expect(landingFormPage.interestStepSubmitButton()).toBeHidden();
    });
  });

  test('accepts a valid 5-digit ZIP code and progresses to the next step', async ({
    landingFormPage,
  }) => {
    await landingFormPage.fillZipCode(zipCodes.serviceAvailable);
    await landingFormPage.submitZipCode();

    await expect(landingFormPage.interestStepSubmitButton()).toBeVisible();
  });
});
