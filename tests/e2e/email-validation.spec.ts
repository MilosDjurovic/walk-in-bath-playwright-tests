import { expect, test } from '../fixtures/test';
import { invalidEmails, zipCodes } from '../fixtures/formData';

test('uses native HTML5 email validation and prevents progressing with invalid email', async ({
  landingFormPage,
}) => {
  await landingFormPage.completeFlowBeforeContactStep(zipCodes.serviceAvailable);
  await landingFormPage.fillName('Jane Candidate');
  await landingFormPage.fillEmail(invalidEmails.missingAt);
  await landingFormPage.submitContactStep();

  const emailValidity = await landingFormPage.getEmailValidity();

  expect(emailValidity.isValid).toBe(false);
  expect(emailValidity.message).toContain('@');
  await expect
    .poll(async () => landingFormPage.isPhoneStepVisible())
    .toBeFalsy();
  await expect(landingFormPage.page).not.toHaveURL(/\/thankyou$/);
});
