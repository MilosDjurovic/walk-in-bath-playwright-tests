import { test as base } from '@playwright/test';
import { validSubmissionData, WalkInBathSubmissionData } from './formData';
import { LandingFormPage } from '../pages/LandingFormPage';

type Fixtures = {
  landingFormPage: LandingFormPage;
  submissionData: WalkInBathSubmissionData;
};

export const test = base.extend<Fixtures>({
  landingFormPage: async ({ page }, use) => {
    const landingFormPage = new LandingFormPage(page);
    await landingFormPage.goto();
    await use(landingFormPage);
  },
  submissionData: async ({}, use) => {
    await use(validSubmissionData);
  },
});

export { expect } from '@playwright/test';
