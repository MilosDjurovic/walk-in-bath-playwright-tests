import { expect, test } from "../fixtures/test";

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

    await form.nameInput.fill(submissionData.fullName);
    await form.emailInput.fill(submissionData.email);
    await form.goToEstimateButton.click();

    await expect(form.phoneInput).toBeVisible();

    await form.phoneInput.fill(submissionData.phone);
    await form.submitRequestButton.click();

    await expect(page).toHaveURL(/\/thankyou$/);
    await expect(landingFormPage.thankYouHeading).toBeVisible();
    await expect(landingFormPage.thankYouHeading).toHaveText("Thank you!");
  });
});
