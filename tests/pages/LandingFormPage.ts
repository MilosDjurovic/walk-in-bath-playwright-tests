import { Locator, Page } from '@playwright/test';

export class LandingFormPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  private form(container = '#form-container-1'): Locator {
    return this.page.locator(container);
  }

  middleFormContainer(): Locator {
    return this.form('#form-container-1');
  }

  bottomFormContainer(): Locator {
    return this.form('#form-container-2');
  }

  bottomZipCodeInput(): Locator {
    return this.bottomFormContainer().getByPlaceholder('Enter ZIP Code');
  }

  bottomZipStepSubmitButton(): Locator {
    return this.bottomFormContainer().locator('button[data-tracking="btn-step-1"]');
  }

  bottomInterestStepSubmitButton(): Locator {
    return this.bottomFormContainer().locator('button[data-tracking="btn-step-2"]');
  }

  zipCodeInput(): Locator {
    return this.form().getByPlaceholder('Enter ZIP Code');
  }

  zipStepSubmitButton(): Locator {
    return this.form().locator('button[data-tracking="btn-step-1"]');
  }

  zipValidationMessage(): Locator {
    return this.form().getByText(/Enter your ZIP code\.|Wrong ZIP code\./).first();
  }

  interestStepSubmitButton(): Locator {
    return this.form().locator('button[data-tracking="btn-step-2"]');
  }

  propertyStepSubmitButton(): Locator {
    return this.form().locator('button[data-tracking="btn-step-3"]');
  }

  contactStepSubmitButton(): Locator {
    return this.form().locator('button[data-tracking="btn-step-4"]');
  }

  phoneStepSubmitButton(): Locator {
    return this.form().locator('button[data-tracking="btn-step-5"]');
  }

  nameInput(): Locator {
    return this.form().getByPlaceholder('Enter Your Name');
  }

  emailInput(): Locator {
    return this.form().getByPlaceholder('Enter Your Email');
  }

  phoneInput(): Locator {
    return this.form().getByPlaceholder('(XXX)XXX-XXXX');
  }

  outOfAreaMessage(): Locator {
    return this.form().getByText(/Sorry, unfortunately.*install in your area/i);
  }

  outOfAreaEmailInput(): Locator {
    return this.form().getByPlaceholder('Email Address');
  }

  async fillZipCode(zipCode: string): Promise<void> {
    await this.zipCodeInput().fill(zipCode);
  }

  async submitZipCode(): Promise<void> {
    await this.zipStepSubmitButton().click();
  }

  async isZipStepVisible(): Promise<boolean> {
    return this.zipStepSubmitButton().isVisible();
  }

  async getZipValidationMessage(): Promise<string> {
    const message = this.zipValidationMessage();
    return (await message.first().textContent())?.trim() ?? '';
  }

  async selectInterest(interest: 'Independence' | 'Safety' | 'Therapy' | 'Other'): Promise<void> {
    await this.form().locator(`label:visible`, { hasText: interest }).first().click();
  }

  async submitInterest(): Promise<void> {
    await this.interestStepSubmitButton().click();
  }

  async isPropertyStepVisible(): Promise<boolean> {
    return this.propertyStepSubmitButton().isVisible();
  }

  async selectPropertyType(type: 'Owned House / Condo' | 'Rental Property' | 'Mobile Home'): Promise<void> {
    await this.form().locator(`label:visible`, { hasText: type }).first().click();
  }

  async submitPropertyType(): Promise<void> {
    await this.propertyStepSubmitButton().click();
  }

  async isContactStepVisible(): Promise<boolean> {
    return this.contactStepSubmitButton().isVisible();
  }

  async fillName(fullName: string): Promise<void> {
    await this.nameInput().fill(fullName);
  }

  async fillEmail(email: string): Promise<void> {
    await this.emailInput().fill(email);
  }

  async submitContactStep(): Promise<void> {
    await this.contactStepSubmitButton().click();
  }

  async isPhoneStepVisible(): Promise<boolean> {
    return this.phoneStepSubmitButton().isVisible();
  }

  async fillPhone(phone: string): Promise<void> {
    await this.phoneInput().fill(phone);
  }

  async getPhoneInputValue(): Promise<string> {
    return this.phoneInput().inputValue();
  }

  async submitPhoneStep(): Promise<void> {
    await this.phoneStepSubmitButton().click();
  }

  async completeFlowBeforeContactStep(zipCode: string): Promise<void> {
    await this.fillZipCode(zipCode);
    await this.submitZipCode();
    await this.selectInterest('Independence');
    await this.submitInterest();
    await this.selectPropertyType('Owned House / Condo');
    await this.submitPropertyType();
  }

  async completeFlowBeforePhoneStep(zipCode: string, fullName: string, email: string): Promise<void> {
    await this.completeFlowBeforeContactStep(zipCode);
    await this.fillName(fullName);
    await this.fillEmail(email);
    await this.submitContactStep();
  }

  async getEmailValidity(): Promise<{ isValid: boolean; message: string }> {
    return this.emailInput()
      .evaluate((input) => {
        const field = input as HTMLInputElement;
        return {
          isValid: field.checkValidity(),
          message: field.validationMessage,
        };
      });
  }

  async isOutOfAreaMessageVisible(): Promise<boolean> {
    return this.outOfAreaMessage().isVisible();
  }

  async isOutOfAreaEmailVisible(): Promise<boolean> {
    return this.outOfAreaEmailInput().isVisible();
  }

  async isInterestStepVisible(): Promise<boolean> {
    return this.interestStepSubmitButton().isVisible();
  }

  async isThankYouPage(): Promise<boolean> {
    return /\/thankyou$/i.test(this.page.url());
  }
}
