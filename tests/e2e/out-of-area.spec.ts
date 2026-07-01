import { expect, test } from '../fixtures/test';
import { zipCodes } from '../fixtures/formData';

test('shows out-of-area branch for ZIP outside service area', async ({ landingFormPage }) => {
  await landingFormPage.fillZipCode(zipCodes.outOfArea);
  await landingFormPage.submitZipCode();

  await expect.poll(async () => landingFormPage.isOutOfAreaMessageVisible()).toBeTruthy();
  await expect(landingFormPage.page).not.toHaveURL(/\/thankyou$/);
  await expect.poll(async () => landingFormPage.isOutOfAreaEmailVisible()).toBeTruthy();
});
