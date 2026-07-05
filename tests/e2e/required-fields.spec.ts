import { expect, test } from "../fixtures/test";

test("enforces required selections and inputs before allowing submission", async ({
  landingFormPage,
  submissionData,
}) => {
  const form = landingFormPage.form1;

  await expect(form.zipInput).toBeVisible();
  await form.nextButton.click();
  // Allow UI transition to settle before asserting final state.
  await landingFormPage.page.waitForTimeout(1000);

  await expect(form.zipErrorMessage).toBeVisible();
  await expect(form.zipErrorMessage).toHaveText("Enter your ZIP code.");
  await expect(form.zipInput).toBeVisible();
  await expect(form.interestOption(submissionData.interest)).toBeHidden();

  await form.zipInput.fill(submissionData.zipCode);
  await form.nextButton.click();
  await expect(form.interestOption(submissionData.interest)).toBeVisible();

  await form.nextButton.click();
  // Allow UI transition to settle before asserting final state.
  await landingFormPage.page.waitForTimeout(1000);

  await expect(form.interestOption(submissionData.interest)).toBeVisible();
  await expect(
    form.container.getByText("Choose one of the variants."),
  ).toBeVisible(); // This is an assumption that the error message should exist here, as it does in the following step
  await expect(
    form.propertyTypeOption(submissionData.propertyType),
  ).toBeHidden();

  await form.interestOption(submissionData.interest).click();
  await form.nextButton.click();
  await expect(
    form.propertyTypeOption(submissionData.propertyType),
  ).toBeVisible();

  await form.nextButton.click();
  // Allow UI transition to settle before asserting final state.
  await landingFormPage.page.waitForTimeout(1000);

  await expect(
    form.container.getByText("Choose one of the variants."),
  ).toBeVisible();
  await expect(
    form.propertyTypeOption(submissionData.propertyType),
  ).toBeVisible();
  await expect(form.nameInput).toBeHidden();
  await expect(form.emailInput).toBeHidden();

  await form.propertyTypeOption(submissionData.propertyType).click();
  await form.nextButton.click();
  await expect(form.nameInput).toBeVisible();
  await expect(form.emailInput).toBeVisible();

  await form.goToEstimateButton.click();
  // Allow UI transition to settle before asserting final state.
  await landingFormPage.page.waitForTimeout(1000);

  await expect(form.nameInput).toBeVisible();
  await expect(form.emailInput).toBeVisible();
  await expect(form.phoneInput).toBeHidden();

  await form.nameInput.fill(submissionData.fullName);
  await form.emailInput.fill(submissionData.email);
  await form.goToEstimateButton.click();
  await expect(form.phoneInput).toBeVisible();

  await form.submitRequestButton.click();
  // Allow UI transition to settle before asserting final state.
  await landingFormPage.page.waitForTimeout(1000);

  await expect(
    form.container.getByText("Enter your phone number."),
  ).toBeVisible();
  await expect(form.phoneInput).toBeVisible();
  await expect(landingFormPage.page).not.toHaveURL(/\/thankyou$/);
  await expect(landingFormPage.thankYouHeading).not.toBeVisible();

  await form.phoneInput.fill(submissionData.phone);
  await form.submitRequestButton.click();

  await expect(landingFormPage.page).toHaveURL(/\/thankyou$/);
  await expect(landingFormPage.thankYouHeading).toBeVisible();
  await expect(landingFormPage.thankYouHeading).toHaveText("Thank you!");
});
