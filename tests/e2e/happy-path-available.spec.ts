import { expect, test } from "../fixtures/test";
import {
  enterPhoneNumber,
  openPhoneStepFromContactDetails,
  reachContactDetailsStep,
} from "./helpers/landingFormFlow";

const formCases = [
  { formKey: "form1" as const, formLabel: "form container 1" },
  { formKey: "form2" as const, formLabel: "form container 2" },
];

formCases.forEach(({ formKey, formLabel }) => {
  test(`submits successfully for service-available ZIP using ${formLabel}`, async ({
    landingFormPage,
    submissionData,
    page,
  }) => {
    const form = landingFormPage[formKey];

    await reachContactDetailsStep(form, submissionData);
    await openPhoneStepFromContactDetails(form, submissionData);

    await enterPhoneNumber(form, submissionData.phone);
    await form.submitRequestButton.click();

    await expect(page).toHaveURL(/\/thankyou$/);
    await expect(landingFormPage.thankYouHeading).toBeVisible();
    await expect(landingFormPage.thankYouHeading).toHaveText("Thank you!");
  });
});
