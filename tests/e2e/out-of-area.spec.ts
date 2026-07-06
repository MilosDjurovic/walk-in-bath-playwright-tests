import { expect, test } from "../fixtures/test";
import { zipCodes } from "../fixtures/formData";

test("user with out-of-area zip code sees unavailable service flow", async ({
  landingFormPage,
  submissionData,
}) => {
  const form = landingFormPage.form1;

  await expect(form.zipInput).toBeVisible();
  await form.zipInput.fill(zipCodes.outOfArea);
  await form.nextButton.click();

  await expect(form.outOfAreaMessage).toBeVisible();
  await expect(form.outOfAreaEmailInput).toBeVisible();

  await form.outOfAreaEmailInput.fill(submissionData.email);
  await form.outOfAreaSubmitButton.click();

  await landingFormPage.expectAtBaseUrl();
  await expect(form.outOfAreaThankYouMessage).toBeVisible();
});
