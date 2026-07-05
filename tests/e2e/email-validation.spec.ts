import { expect, test } from "../fixtures/test";
import { invalidEmails, zipCodes } from "../fixtures/formData";

test.describe("email validation", () => {
  const invalidEmailCases = Object.values(invalidEmails);

  invalidEmailCases.forEach((invalidEmail) => {
    test(`blocks progression for invalid email: ${invalidEmail}`, async ({
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
      await form.emailInput.fill(invalidEmail);
      await form.goToEstimateButton.click();
      await expect(form.emailInput).toBeVisible();
      // Allow UI transition to settle before asserting final state.
      await landingFormPage.page.waitForTimeout(1000);
      await expect(form.phoneInput).toBeHidden();
    });
  });
});
