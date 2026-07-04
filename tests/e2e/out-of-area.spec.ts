import { expect, test } from '../fixtures/test';
import { zipCodes } from '../fixtures/formData';

test('user with out-of-area zip code sees unavailable service flow', async ({ landingFormPage, submissionData }) => {
  const form = landingFormPage.form1;

  await expect(form.zipInput).toBeVisible();
  await form.zipInput.fill(zipCodes.outOfArea);
  await form.nextButton.click();

  await expect(form.outOfAreaMessage).toBeVisible();
  await expect(form.outOfAreaMessage).toHaveText(
    'Sorry, unfortunately we don’t yet install in your area but if you’d like us to notify you when we do please enter your email address below',
  );
  await expect(form.outOfAreaEmailInput).toBeVisible();

  await form.outOfAreaEmailInput.fill(submissionData.email);
  await form.outOfAreaSubmitButton.click();

  await expect(landingFormPage.page).toHaveURL(/^https:\/\/test-qa\.capslock\.global\/(?:[?#].*)?$/);
  await expect(form.outOfAreaThankYouMessage).toBeVisible();
  await expect(form.outOfAreaThankYouMessage).toHaveText(
    'Thank you for your interest, we will contact you when our service becomes available in your area!',
  );
});
