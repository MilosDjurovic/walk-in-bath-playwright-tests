import { expect, test } from "../fixtures/testFixtures";
import { invalidPhoneValues } from "../fixtures/formData";
import {
  enterPhoneNumber,
  expectPhoneError,
  openPhoneStepFromContactDetails,
  reachContactDetailsStep,
} from "./helpers/landingFormFlowHelpers";

test.describe("phone validation", () => {
  invalidPhoneValues.forEach((invalidPhone) => {
    test(`should block progression for invalid phone number: ${invalidPhone}`, async ({
      landingFormPage,
      submissionData,
    }) => {
      const form = landingFormPage.form1;

      await reachContactDetailsStep(form, submissionData);
      await openPhoneStepFromContactDetails(form, submissionData);

      await enterPhoneNumber(form, invalidPhone);
      await form.submitRequestButton.click();
      await expect(form.phoneErrorMessage).toBeVisible();
      await expectPhoneError(form, "invalid");
    });
  });
});
