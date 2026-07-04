import { expect, test } from '../fixtures/test';
import { zipCodes } from '../fixtures/formData';

test.describe('ZIP code step', () => {
  const invalidZipCodes = [zipCodes.invalidTooShort, zipCodes.invalidTooLong, zipCodes.invalidNonDigit];

  // test('requires a ZIP code before allowing users to continue', async ({ landingFormPage, submissionData }) => {
  //   const form = landingFormPage.form1;

  //   await expect(form.zipInput).toBeVisible();
  //   await form.nextButton.click();
    
  //   await expect(landingFormPage.page).toHaveURL(/^https:\/\/test-qa\.capslock\.global\/(?:[?#].*)?$/);
  //   await expect(form.zipErrorMessage).toHaveText('Enter your ZIP code.');
  //   await expect(form.zipInput).toBeVisible();
  //   await expect(form.interestOption(submissionData.interest)).toBeHidden();
  // });

  invalidZipCodes.forEach((invalidZipCode) => {
    test(`rejects invalid ZIP code: ${invalidZipCode}`, async ({ landingFormPage, submissionData }) => {
      const form = landingFormPage.form1;

      await expect(form.zipInput).toBeVisible();
      await form.zipInput.fill(invalidZipCode);
      await form.nextButton.click();

      await expect(form.zipErrorMessage).toHaveText('Wrong ZIP code.');
      await expect(form.zipInput).toBeVisible();
      await expect(form.interestOption(submissionData.interest)).toBeHidden();
    });
  });
});
