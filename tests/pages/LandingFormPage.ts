import { Locator, Page } from "@playwright/test";

const OUT_OF_AREA_MESSAGE_TEXT =
  "Sorry, unfortunately we don’t yet install in your area but if you’d like us to notify you when we do please enter your email address below";
const OUT_OF_AREA_THANK_YOU_MESSAGE_TEXT =
  "Thank you for your interest, we will contact you when our service becomes available in your area!";
const VARIANT_SELECTION_ERROR_MESSAGE_TEXT = "Choose one of the variants.";

export type FormLocators = {
  container: Locator;
  zipInput: Locator;
  nextButton: Locator;
  outOfAreaMessage: Locator;
  outOfAreaEmailInput: Locator;
  outOfAreaSubmitButton: Locator;
  outOfAreaThankYouMessage: Locator;
  interestOption: (optionText: string) => Locator;
  propertyTypeOption: (optionText: string) => Locator;
  nameInput: Locator;
  emailInput: Locator;
  goToEstimateButton: Locator;
  phoneInput: Locator;
  submitRequestButton: Locator;
  zipErrorMessage: Locator;
  variantSelectionErrorMessage: Locator;
  phoneErrorMessage: Locator;
};

export class LandingFormPage {
  readonly page: Page;
  readonly form1: FormLocators;
  readonly form2: FormLocators;
  readonly thankYouHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.form1 = this.buildFormLocators("#form-container-1");
    this.form2 = this.buildFormLocators("#form-container-2");
    this.thankYouHeading = this.page.getByRole("heading", {
      name: "Thank you!",
    });
  }

  async goto(): Promise<void> {
    await this.page.goto("/");
  }

  private buildFormLocators(containerSelector: string): FormLocators {
    const container = this.page.locator(containerSelector);

    return {
      container,
      zipInput: container.getByRole("textbox", { name: "Enter ZIP Code" }),
      nextButton: container.getByRole("button", { name: /^Next/ }),
      outOfAreaMessage: container.getByText(OUT_OF_AREA_MESSAGE_TEXT, {
        exact: true,
      }),
      outOfAreaEmailInput: container.getByRole("textbox", {
        name: "Email Address",
      }),
      outOfAreaSubmitButton: container.getByRole("button", { name: "Submit" }),
      outOfAreaThankYouMessage: container.getByText(
        OUT_OF_AREA_THANK_YOU_MESSAGE_TEXT,
        { exact: true },
      ),
      interestOption: (optionText: string) =>
        container.getByText(optionText, { exact: true }),
      propertyTypeOption: (optionText: string) =>
        container.getByText(optionText, { exact: true }),
      nameInput: container.getByRole("textbox", { name: "Enter Your Name" }),
      emailInput: container.getByRole("textbox", { name: "Enter Your Email" }),
      goToEstimateButton: container.getByRole("button", {
        name: "Go To Estimate",
      }),
      phoneInput: container.getByRole("textbox", { name: "(XXX)XXX-XXXX" }),
      submitRequestButton: container.getByRole("button", {
        name: "Submit Your Request",
      }),
      zipErrorMessage: container.getByText(
        /Enter your ZIP code\.|Wrong ZIP code\./,
      ),
      variantSelectionErrorMessage: container.getByText(
        VARIANT_SELECTION_ERROR_MESSAGE_TEXT,
        { exact: true },
      ),
      phoneErrorMessage: container.getByText(
        /Enter your phone number\.|Wrong phone number\./,
      ),
    };
  }
}
