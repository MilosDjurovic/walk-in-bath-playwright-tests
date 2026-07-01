import { expect, test } from '../fixtures/test';

test('blocks progression when required fields are not provided', async ({ landingFormPage }) => {
  await landingFormPage.submitZipCode();

  await expect
    .poll(async () => landingFormPage.getZipValidationMessage())
    .toContain('Enter your ZIP code.');

  await landingFormPage.fillZipCode('68901');
  await landingFormPage.submitZipCode();
  await landingFormPage.submitInterest();

  await expect
    .poll(async () => landingFormPage.isPropertyStepVisible())
    .toBeFalsy();

  await expect
    .poll(async () => landingFormPage.isInterestStepVisible())
    .toBeTruthy();
});
