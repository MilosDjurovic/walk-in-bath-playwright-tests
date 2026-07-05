import { expect, test } from "../fixtures/test";
import { invalidZipCodes } from "../fixtures/formData";

test.describe("ZIP code step", () => {
  const invalidZipCodeCases = [
    invalidZipCodes.tooShort,
    invalidZipCodes.tooLong,
    invalidZipCodes.nonDigit,
  ];

  invalidZipCodeCases.forEach((invalidZipCode) => {
    test(`rejects invalid ZIP code: ${invalidZipCode}`, async ({
      landingFormPage,
      submissionData,
    }) => {
      const form = landingFormPage.form1;

      await expect(form.zipInput).toBeVisible();
      await form.zipInput.fill(invalidZipCode);
      await form.nextButton.click();
      // Allow UI transition to settle before asserting final state.
      await landingFormPage.page.waitForTimeout(1000);

      await expect(form.zipErrorMessage).toHaveText("Wrong ZIP code.");
      await expect(form.zipInput).toBeVisible();
      await expect(form.interestOption(submissionData.interest)).toBeHidden();
    });
  });
});
