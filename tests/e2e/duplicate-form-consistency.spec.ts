import { Locator } from '@playwright/test';
import { expect, test } from '../fixtures/test';

async function distanceToViewportCenter(locator: Locator): Promise<number> {
  return locator.evaluate((element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const formCenterY = rect.top + rect.height / 2;
    const viewportCenterY = (window.innerHeight || document.documentElement.clientHeight) / 2;
    return Math.abs(formCenterY - viewportCenterY);
  });
}

test('keeps users in bottom-form context after step-1 submission', async ({
  landingFormPage,
  submissionData,
}) => {
  const middleForm = landingFormPage.middleFormContainer();
  const bottomForm = landingFormPage.bottomFormContainer();

  await bottomForm.scrollIntoViewIfNeeded();
  await expect(bottomForm).toBeInViewport();

  const scrollYBeforeSubmit = await landingFormPage.page.evaluate(() => window.scrollY);

  await landingFormPage.bottomZipCodeInput().fill(submissionData.zipCode);
  await landingFormPage.bottomZipStepSubmitButton().click();

  await expect(landingFormPage.bottomInterestStepSubmitButton()).toBeVisible();

  const scrollYAfterSubmit = await landingFormPage.page.evaluate(() => window.scrollY);
  expect(scrollYAfterSubmit).toBe(scrollYBeforeSubmit);
  await expect
    .poll(async () => {
      const bottomDistance = await distanceToViewportCenter(bottomForm);
      const middleDistance = await distanceToViewportCenter(middleForm);
      return bottomDistance < middleDistance;
    })
    .toBeTruthy();
});
