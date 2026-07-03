import { expect, test } from '../fixtures/test';
import { zipCodes } from '../fixtures/formData';

test('shows out-of-area branch for ZIP outside service area', async ({ landingFormPage }) => {
  await landingFormPage.fillZipCode(zipCodes.outOfArea);
  await landingFormPage.submitZipCode();

  await expect(landingFormPage.outOfAreaMessage()).toBeVisible();
  await expect(landingFormPage.outOfAreaEmailInput()).toBeVisible();
  await expect(landingFormPage.interestStepSubmitButton()).toBeHidden();
  await expect(landingFormPage.phoneStepSubmitButton()).toBeHidden();
  await expect(landingFormPage.page).not.toHaveURL(/\/thankyou$/);
});
