import { expect, test } from '../fixtures/test';
import { invalidEmails, zipCodes } from '../fixtures/formData';

test.describe('email validation', () => {
  const invalidEmailCases = [invalidEmails.missingAt, invalidEmails.missingDomain];

  invalidEmailCases.forEach((invalidEmail) => {
    test(`blocks progression for invalid email: ${invalidEmail}`, async ({
      landingFormPage,
      submissionData,
    }) => {
      await landingFormPage.completeFlowBeforeContactStep(zipCodes.serviceAvailable);
      await landingFormPage.fillName(submissionData.fullName);
      await landingFormPage.fillEmail(invalidEmail);
      await landingFormPage.submitContactStep();

      const emailValidity = await landingFormPage.getEmailValidity();
      expect(emailValidity.isValid).toBe(false);
      expect(emailValidity.message.length).toBeGreaterThan(0);

      await expect(landingFormPage.contactStepSubmitButton()).toBeVisible();
      await expect(landingFormPage.phoneStepSubmitButton()).toBeHidden();
      await expect(landingFormPage.page).not.toHaveURL(/\/thankyou$/);
    });
  });

  test('accepts valid email and progresses to phone step', async ({
    landingFormPage,
    submissionData,
  }) => {
    await landingFormPage.completeFlowBeforeContactStep(zipCodes.serviceAvailable);
    await landingFormPage.fillName(submissionData.fullName);
    await landingFormPage.fillEmail(submissionData.email);

    const validEmailValidity = await landingFormPage.getEmailValidity();
    expect(validEmailValidity.isValid).toBe(true);
    expect(validEmailValidity.message).toBe('');

    await landingFormPage.submitContactStep();

    await expect(landingFormPage.phoneStepSubmitButton()).toBeVisible();
    await expect(landingFormPage.contactStepSubmitButton()).toBeHidden();
    await expect(landingFormPage.page).not.toHaveURL(/\/thankyou$/);
  });
});
