import { expect, test } from "../fixtures/testFixtures";
import {
  expectPhoneError,
  expectStableStepIdentity,
  openPhoneStepFromContactDetails,
  reachInterestStep,
  reachContactDetailsStep,
} from "./helpers/landingFormFlowHelpers";

test.describe("required fields", () => {
  test("should block progression when ZIP is missing", async ({
    landingFormPage,
    submissionData,
  }) => {
    const form = landingFormPage.form1;

    await expect(form.zipInput).toBeVisible();
    await form.nextButton.click();
    await expectStableStepIdentity(form, "zip", submissionData);

    await expect(form.zipErrorMessage).toBeVisible();
    await expect(form.zipErrorMessage).toHaveText("Enter your ZIP code.");
    await expect(form.interestOption(submissionData.interest)).toBeHidden();
  });

  test("should block progression when interest is missing", async ({
    landingFormPage,
    submissionData,
  }) => {
    const form = landingFormPage.form1;

    await reachInterestStep(form, submissionData);

    await form.nextButton.click();
    await expectStableStepIdentity(form, "interest-selection", submissionData);

    await expect(form.variantSelectionErrorMessage).toBeVisible();
    await expect(
      form.propertyTypeOption(submissionData.propertyType),
    ).toBeHidden();
  });

  test("should block progression when property type is missing", async ({
    landingFormPage,
    submissionData,
  }) => {
    const form = landingFormPage.form1;

    await reachInterestStep(form, submissionData);

    await form.interestOption(submissionData.interest).click();
    await form.nextButton.click();
    await expect(
      form.propertyTypeOption(submissionData.propertyType),
    ).toBeVisible();

    await form.nextButton.click();
    await expectStableStepIdentity(form, "property-selection", submissionData);

    await expect(form.variantSelectionErrorMessage).toBeVisible();
    await expect(form.nameInput).toBeHidden();
    await expect(form.emailInput).toBeHidden();
  });

  test("should block progression when contact details are missing", async ({
    landingFormPage,
    submissionData,
  }) => {
    const form = landingFormPage.form1;

    await reachContactDetailsStep(form, submissionData);
    await form.goToEstimateButton.click();
    await expectStableStepIdentity(form, "contact-details", submissionData);

    await expect(form.nameInput).toBeVisible();
    await expect(form.emailInput).toBeVisible();
    await expect(form.phoneInput).toBeHidden();
  });

  test("should block submission when phone is missing", async ({
    landingFormPage,
    submissionData,
  }) => {
    const form = landingFormPage.form1;

    await reachContactDetailsStep(form, submissionData);
    await openPhoneStepFromContactDetails(form, submissionData);

    await form.submitRequestButton.click();
    await expectStableStepIdentity(form, "phone", submissionData);

    await expectPhoneError(form, "required");
    await expect(landingFormPage.page).not.toHaveURL(/\/thankyou$/);
    await expect(landingFormPage.thankYouHeading).not.toBeVisible();
  });
});
