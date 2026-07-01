import { expect, test } from '../fixtures/test';
import { invalidPhones } from '../fixtures/formData';

test('prevents submission when phone number is not exactly 10 digits', async ({
  landingFormPage,
  submissionData,
}) => {
  await landingFormPage.completeFlowBeforePhoneStep(
    submissionData.zipCode,
    submissionData.fullName,
    submissionData.email,
  );
  await landingFormPage.fillPhone(invalidPhones.tooShort);
  await landingFormPage.submitPhoneStep();

  await expect
    .poll(async () => landingFormPage.isThankYouPage())
    .toBeFalsy();
  await expect
    .poll(async () => landingFormPage.isPhoneStepVisible())
    .toBeTruthy();

  const phoneValue = await landingFormPage.getPhoneInputValue();
  expect(phoneValue.includes('_')).toBe(true);
});
