import { expect, test } from "../fixtures/testFixtures";
import { zipCodes } from "../fixtures/formData";

test("should show unavailable service flow for out-of-area ZIP", async ({
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

  await expect(landingFormPage.page).toHaveURL(/\/$/);
  await expect(form.outOfAreaThankYouMessage).toBeVisible();
});
