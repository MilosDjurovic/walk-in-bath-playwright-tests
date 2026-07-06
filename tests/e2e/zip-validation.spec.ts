import { expect, test } from "../fixtures/testFixtures";
import { invalidZipCodeValues } from "../fixtures/formData";

test.describe("zip validation", () => {
  invalidZipCodeValues.forEach((invalidZipCode) => {
    test(`should reject invalid ZIP code: ${invalidZipCode}`, async ({
      landingFormPage,
      submissionData,
    }) => {
      const form = landingFormPage.form1;

      await expect(form.zipInput).toBeVisible();
      await form.zipInput.fill(invalidZipCode);
      await form.nextButton.click();
      await expect(form.zipErrorMessage).toBeVisible();

      await expect(form.zipErrorMessage).toHaveText("Wrong ZIP code.");
      await expect(form.zipInput).toBeVisible();
      await expect(form.interestOption(submissionData.interest)).toBeHidden();
    });
  });
});
