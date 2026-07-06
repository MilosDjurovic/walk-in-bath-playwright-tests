import { expect, test } from "../fixtures/testFixtures";
import {
  enterPhoneNumber,
  openPhoneStepFromContactDetails,
  reachContactDetailsStep,
} from "./helpers/landingFormFlowHelpers";

const formContainerCases = [
  { formLocatorKey: "form1" as const, formContainerLabel: "form container 1" },
  { formLocatorKey: "form2" as const, formContainerLabel: "form container 2" },
];

test.describe("service-available submission", () => {
  formContainerCases.forEach(({ formLocatorKey, formContainerLabel }) => {
    test(`should submit successfully for service-available ZIP using ${formContainerLabel}`, async ({
      landingFormPage,
      submissionData,
      page,
    }) => {
      const activeForm = landingFormPage[formLocatorKey];

      await reachContactDetailsStep(activeForm, submissionData);
      await openPhoneStepFromContactDetails(activeForm, submissionData);

      await enterPhoneNumber(activeForm, submissionData.phone);
      await activeForm.submitRequestButton.click();

      await expect(page).toHaveURL(/\/thankyou$/);
      await expect(landingFormPage.thankYouHeading).toBeVisible();
      await expect(landingFormPage.thankYouHeading).toHaveText("Thank you!");
    });
  });
});
