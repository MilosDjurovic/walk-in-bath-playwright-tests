import { expect, test } from "../fixtures/test";
import { invalidEmailValues } from "../fixtures/formData";
import { reachContactDetailsStep } from "./helpers/landingFormFlow";

test.describe("email validation", () => {
  invalidEmailValues.forEach((invalidEmail) => {
    test(`blocks progression for invalid email: ${invalidEmail}`, async ({
      landingFormPage,
      submissionData,
    }) => {
      const form = landingFormPage.form1;

      await reachContactDetailsStep(form, submissionData);

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
