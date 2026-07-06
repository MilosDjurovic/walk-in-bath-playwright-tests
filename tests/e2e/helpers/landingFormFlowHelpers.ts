import { expect } from "@playwright/test";

import type { WalkInBathSubmissionData } from "../../fixtures/formData";
import type { FormLocators } from "../../pages/LandingFormPage";

const phoneErrorMessageByType = {
  required: "Enter your phone number.",
  invalid: "Wrong phone number.",
} as const;

export type PhoneErrorType = keyof typeof phoneErrorMessageByType;
export type FormStepIdentity =
  | "zip"
  | "interest-selection"
  | "property-selection"
  | "contact-details"
  | "phone";

export async function reachInterestStep(
  form: FormLocators,
  submissionData: WalkInBathSubmissionData,
): Promise<void> {
  await expect(form.zipInput).toBeVisible();
  await form.zipInput.fill(submissionData.zipCode);
  await form.nextButton.click();
  await expect(form.interestOption(submissionData.interest)).toBeVisible();
}

async function detectStepIdentity(
  form: FormLocators,
  submissionData?: WalkInBathSubmissionData,
): Promise<FormStepIdentity | "unknown"> {
  const interestVisible = submissionData
    ? await form.interestOption(submissionData.interest).isVisible()
    : false;
  const propertyVisible = submissionData
    ? await form.propertyTypeOption(submissionData.propertyType).isVisible()
    : false;

  const [
    zipVisible,
    goToEstimateVisible,
    submitRequestVisible,
    phoneVisible,
    nameVisible,
    emailVisible,
  ] = await Promise.all([
    form.zipInput.isVisible(),
    form.goToEstimateButton.isVisible(),
    form.submitRequestButton.isVisible(),
    form.phoneInput.isVisible(),
    form.nameInput.isVisible(),
    form.emailInput.isVisible(),
  ]);

  if (submitRequestVisible && phoneVisible) {
    return "phone";
  }

  if (goToEstimateVisible && nameVisible && emailVisible && !phoneVisible) {
    return "contact-details";
  }

  if (propertyVisible && !nameVisible && !emailVisible && !phoneVisible) {
    return "property-selection";
  }

  if (
    interestVisible &&
    !propertyVisible &&
    !nameVisible &&
    !emailVisible &&
    !phoneVisible
  ) {
    return "interest-selection";
  }

  if (
    zipVisible &&
    !interestVisible &&
    !propertyVisible &&
    !nameVisible &&
    !emailVisible &&
    !phoneVisible
  ) {
    return "zip";
  }

  return "unknown";
}

export async function reachContactDetailsStep(
  form: FormLocators,
  submissionData: WalkInBathSubmissionData,
): Promise<void> {
  await reachInterestStep(form, submissionData);
  await form.interestOption(submissionData.interest).click();
  await form.nextButton.click();

  await expect(
    form.propertyTypeOption(submissionData.propertyType),
  ).toBeVisible();
  await form.propertyTypeOption(submissionData.propertyType).click();
  await form.nextButton.click();

  await expect(form.nameInput).toBeVisible();
  await expect(form.emailInput).toBeVisible();
}

export async function openPhoneStepFromContactDetails(
  form: FormLocators,
  submissionData: WalkInBathSubmissionData,
): Promise<void> {
  await form.nameInput.fill(submissionData.fullName);
  await form.emailInput.fill(submissionData.email);
  await form.goToEstimateButton.click();

  await expect(form.phoneInput).toBeVisible();
}

export async function enterPhoneNumber(
  form: FormLocators,
  phoneNumber: string,
): Promise<void> {
  await expect(form.phoneInput).toBeVisible();
  await form.phoneInput.click();
  await form.phoneInput.press("ControlOrMeta+A");

  // Use real key events for masked inputs; fill() can be flaky with some masks.
  await form.phoneInput.pressSequentially(phoneNumber);

  const expectedDigits = phoneNumber.replace(/\D/g, "");
  await expect
    .poll(async () => {
      const currentValue = await form.phoneInput.inputValue();
      return currentValue.replace(/\D/g, "");
    })
    .toBe(expectedDigits);
}

export async function expectPhoneError(
  form: FormLocators,
  errorType: PhoneErrorType,
): Promise<void> {
  await expect(form.phoneInput).toBeVisible();
  await expect(form.phoneErrorMessage).toBeVisible();
  await expect(form.phoneErrorMessage).toHaveText(
    phoneErrorMessageByType[errorType],
  );
}

export async function expectStableStepIdentity(
  form: FormLocators,
  expectedStepIdentity: FormStepIdentity,
  submissionData?: WalkInBathSubmissionData,
): Promise<void> {
  await expect
    .poll(async () => detectStepIdentity(form, submissionData), {
      timeout: 4000,
      message: `Expected form to settle on step: ${expectedStepIdentity}`,
    })
    .toBe(expectedStepIdentity);

  // Sample the state a few more times to avoid passing on a transient frame.
  for (let i = 0; i < 5; i += 1) {
    await form.container.page().waitForTimeout(150);
    await expect(await detectStepIdentity(form, submissionData)).toBe(
      expectedStepIdentity,
    );
  }
}
