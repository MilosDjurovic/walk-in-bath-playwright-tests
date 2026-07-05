import { expect, test } from "../fixtures/test";
import { invalidPhoneValues } from "../fixtures/formData";
import {
  enterPhoneNumber,
  expectPhoneError,
  openPhoneStepFromContactDetails,
  reachContactDetailsStep,
} from "./helpers/landingFormFlow";

test.describe("phone validation", () => {
  invalidPhoneValues.forEach((invalidPhone) => {
    test(`blocks progression for invalid phone number: ${invalidPhone}`, async ({
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
