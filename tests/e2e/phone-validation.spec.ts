import { expect, test } from "../fixtures/test";
import { invalidPhones } from "../fixtures/formData";

test.describe("phone validation", () => {
  const invalidPhoneCases = Object.values(invalidPhones);

  invalidPhoneCases.forEach((invalidPhone) => {
    test(`blocks progression for invalid phone number: ${invalidPhone}`, async ({
      landingFormPage,
      submissionData,
    }) => {
      const form = landingFormPage.form1;

      await form.zipInput.fill(submissionData.zipCode);
      await form.nextButton.click();
      await expect(form.interestOption(submissionData.interest)).toBeVisible();

      await form.interestOption(submissionData.interest).click();
      await form.nextButton.click();
      await expect(
        form.propertyTypeOption(submissionData.propertyType),
      ).toBeVisible();

      await form.propertyTypeOption(submissionData.propertyType).click();
      await form.nextButton.click();
      await expect(form.nameInput).toBeVisible();
      await expect(form.emailInput).toBeVisible();

      await form.nameInput.fill(submissionData.fullName);
      await form.emailInput.fill(submissionData.email);
      await form.goToEstimateButton.click();
      await expect(form.phoneInput).toBeVisible();

      await form.phoneInput.fill(invalidPhone);
      await form.submitRequestButton.click();
      // Allow UI transition to settle before asserting final state.
      await landingFormPage.page.waitForTimeout(1000);
      await expect(form.phoneInput).toBeVisible();
      await expect(form.phoneErrorMessage).toBeVisible();
      await expect(form.phoneErrorMessage).toHaveText("Wrong phone number.");
    });
  });
});
