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

  async fillZipCode(zipCode: string): Promise<void> {
    await this.form().getByPlaceholder('Enter ZIP Code').fill(zipCode);
  }

  async submitZipCode(): Promise<void> {
    await this.form().locator('button[data-tracking="btn-step-1"]').click();
  }

  async getZipValidationMessage(): Promise<string> {
    const message = this.form().locator('text=/Enter your ZIP code.|Wrong ZIP code./');
    return (await message.first().textContent())?.trim() ?? '';
  }

  async selectInterest(interest: 'Independence' | 'Safety' | 'Therapy' | 'Other'): Promise<void> {
    await this.form().getByText(interest, { exact: true }).click();
  }

  async submitInterest(): Promise<void> {
    await this.form().locator('button[data-tracking="btn-step-2"]').click();
  }

  async isPropertyStepVisible(): Promise<boolean> {
    return this.form().getByText('Owned House / Condo', { exact: true }).isVisible();
  }

  async selectPropertyType(type: 'Owned House / Condo' | 'Rental Property' | 'Mobile Home'): Promise<void> {
    await this.form().getByText(type, { exact: true }).click();
  }

  async submitPropertyType(): Promise<void> {
    await this.form().locator('button[data-tracking="btn-step-3"]').click();
  }

  async fillName(fullName: string): Promise<void> {
    await this.form().getByPlaceholder('Enter Your Name').fill(fullName);
  }

  async fillEmail(email: string): Promise<void> {
    await this.form().getByPlaceholder('Enter Your Email').fill(email);
  }

  async submitContactStep(): Promise<void> {
    await this.form().locator('button[data-tracking="btn-step-4"]').click();
  }

  async isPhoneStepVisible(): Promise<boolean> {
    return this.form().getByPlaceholder('(XXX)XXX-XXXX').isVisible();
  }

  async fillPhone(phone: string): Promise<void> {
    await this.form().getByPlaceholder('(XXX)XXX-XXXX').fill(phone);
  }

  async getPhoneInputValue(): Promise<string> {
    return this.form().getByPlaceholder('(XXX)XXX-XXXX').inputValue();
  }

  async submitPhoneStep(): Promise<void> {
    await this.form().locator('button[data-tracking="btn-step-5"]').click();
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
    return this.form()
      .getByPlaceholder('Enter Your Email')
      .evaluate((input) => {
        const field = input as HTMLInputElement;
        return {
          isValid: field.checkValidity(),
          message: field.validationMessage,
        };
      });
  }

  async isOutOfAreaMessageVisible(): Promise<boolean> {
    return this.form()
      .getByText(/Sorry, unfortunately.*install in your area/i)
      .isVisible();
  }

  async isOutOfAreaEmailVisible(): Promise<boolean> {
    return this.form().getByPlaceholder('Email Address').isVisible();
  }

  async isInterestStepVisible(): Promise<boolean> {
    return this.form().getByText('Why are you interested in a walk-in tub?', { exact: true }).isVisible();
  }

  async isThankYouPage(): Promise<boolean> {
    return /\/thankyou$/i.test(this.page.url());
  }
}
