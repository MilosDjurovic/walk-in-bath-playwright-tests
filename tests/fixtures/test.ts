import { test as base } from "@playwright/test";
import {
  interestOptions,
  propertyTypeOptions,
  validSubmissionData,
  WalkInBathSubmissionData,
} from "./formData";
import { LandingFormPage } from "../pages/LandingFormPage";

type Fixtures = {
  landingFormPage: LandingFormPage;
  submissionData: WalkInBathSubmissionData;
};

function pickRandomOption<T extends readonly string[]>(options: T): T[number] {
  return options[Math.floor(Math.random() * options.length)];
}

function generateRandomEmail(): string {
  const timestamp = Date.now();
  const suffix = Math.floor(Math.random() * 1_000_000);
  return `qatest+${timestamp}${suffix}@test.com`;
}

function generateRandomPhone(): string {
  const firstDigit = Math.floor(Math.random() * 8) + 2;
  let rest = "";

  for (let i = 0; i < 9; i += 1) {
    rest += Math.floor(Math.random() * 10).toString();
  }

  return `${firstDigit}${rest}`;
}

export const test = base.extend<Fixtures>({
  landingFormPage: async ({ page }, use) => {
    const landingFormPage = new LandingFormPage(page);
    await landingFormPage.goto();
    await use(landingFormPage);
  },
  submissionData: async ({}, use) => {
    await use({
      ...validSubmissionData,
      interest: pickRandomOption(interestOptions),
      propertyType: pickRandomOption(propertyTypeOptions),
      email: generateRandomEmail(),
      phone: generateRandomPhone(),
    });
  },
});

export { expect } from "@playwright/test";
