import { expect, test } from '../fixtures/test';

test('prevents progressing from the interest step when no option is selected', async ({
  landingFormPage,
  submissionData,
}) => {
  await landingFormPage.fillZipCode(submissionData.zipCode);
  await landingFormPage.submitZipCode();
  await landingFormPage.submitInterest();

  await expect(landingFormPage.propertyStepSubmitButton()).toBeHidden();
  await expect(landingFormPage.interestStepSubmitButton()).toBeVisible();
});
