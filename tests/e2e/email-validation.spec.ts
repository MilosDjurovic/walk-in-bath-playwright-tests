import { test } from "../fixtures/testFixtures";
import { invalidEmailValues } from "../fixtures/formData";
import {
  expectStableStepIdentity,
  reachContactDetailsStep,
} from "./helpers/landingFormFlowHelpers";

test.describe("email validation", () => {
  invalidEmailValues.forEach((invalidEmail) => {
    test(`should block progression for invalid email: ${invalidEmail}`, async ({
      landingFormPage,
      submissionData,
    }) => {
      const form = landingFormPage.form1;

      await reachContactDetailsStep(form, submissionData);

      await form.nameInput.fill(submissionData.fullName);
      await form.emailInput.fill(invalidEmail);
      await form.goToEstimateButton.click();
      await expectStableStepIdentity(form, "contact-details");
    });
  });
});
