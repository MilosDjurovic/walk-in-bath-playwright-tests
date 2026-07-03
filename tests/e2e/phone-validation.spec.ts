import { expect, test } from '../fixtures/test';
import { invalidPhones } from '../fixtures/formData';

test.describe('phone validation', () => {
  const blockingInvalidPhoneCases = [
    {
      label: 'too short',
      phone: invalidPhones.tooShort,
      assertion: (normalized: string) => expect(normalized.length).toBeLessThan(10),
    },
    {
      label: 'with letters',
      phone: invalidPhones.withLetters,
      assertion: (normalized: string) => expect(normalized.length).toBeLessThan(10),
    },
  ];

  test('normalizes too-long phone input to supported length', async ({
    landingFormPage,
    submissionData,
  }) => {
    await landingFormPage.completeFlowBeforePhoneStep(
      submissionData.zipCode,
      submissionData.fullName,
      submissionData.email,
    );

    await landingFormPage.fillPhone(invalidPhones.tooLong);

    const normalizedValue = await landingFormPage.getPhoneInputValue();
    expect(normalizedValue.replace(/\D/g, '').length).toBeLessThanOrEqual(10);
  });

  blockingInvalidPhoneCases.forEach(({ label, phone, assertion }) => {
    test(`prevents submission for invalid phone (${label})`, async ({
      landingFormPage,
      submissionData,
    }) => {
      await landingFormPage.completeFlowBeforePhoneStep(
        submissionData.zipCode,
        submissionData.fullName,
        submissionData.email,
      );
      await landingFormPage.fillPhone(phone);
      await landingFormPage.submitPhoneStep();

      await expect(landingFormPage.page).not.toHaveURL(/\/thankyou$/);
      await expect(landingFormPage.phoneStepSubmitButton()).toBeVisible();

      const currentValue = await landingFormPage.getPhoneInputValue();
      assertion(currentValue.replace(/\D/g, ''));
    });
  });

  test('accepts valid 10-digit phone and submits successfully', async ({
    landingFormPage,
    submissionData,
  }) => {
    await landingFormPage.completeFlowBeforePhoneStep(
      submissionData.zipCode,
      submissionData.fullName,
      submissionData.email,
    );
    await landingFormPage.fillPhone(submissionData.phone);
    await landingFormPage.submitPhoneStep();

    await expect(landingFormPage.page).toHaveURL(/\/thankyou$/);
  });
});
