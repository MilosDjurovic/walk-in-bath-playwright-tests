import { expect } from "@playwright/test";

import type { WalkInBathSubmissionData } from "../../fixtures/formData";
import type { FormLocators } from "../../pages/LandingFormPage";

const phoneErrorMessages = {
  required: "Enter your phone number.",
  invalid: "Wrong phone number.",
} as const;

export type PhoneErrorType = keyof typeof phoneErrorMessages;

export async function reachContactDetailsStep(
  form: FormLocators,
  submissionData: WalkInBathSubmissionData,
): Promise<void> {
  await expect(form.zipInput).toBeVisible();
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
    phoneErrorMessages[errorType],
  );
}
