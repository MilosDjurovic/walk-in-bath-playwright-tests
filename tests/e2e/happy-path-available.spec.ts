import { expect, test } from '../fixtures/test';

test('submits successfully for service-available ZIP and redirects to thank-you page', async ({
  landingFormPage,
  submissionData,
}) => {
  await landingFormPage.completeFlowBeforePhoneStep(
    submissionData.zipCode,
    submissionData.fullName,
    submissionData.email,
  );

  await expect(landingFormPage.phoneStepSubmitButton()).toBeVisible();
  await expect(landingFormPage.page).not.toHaveURL(/\/thankyou$/);

  await landingFormPage.fillPhone(submissionData.phone);
  await landingFormPage.submitPhoneStep();

  await expect(landingFormPage.page).toHaveURL(/\/thankyou$/);
  await expect(landingFormPage.page.getByRole('heading', { name: 'Thank you!' })).toBeVisible();
});
