// import { expect, test } from '../fixtures/test';
// import { invalidEmails, zipCodes } from '../fixtures/formData';

// test.describe('email validation', () => {
//   const invalidEmailCases = Object.values(invalidEmails);

//   invalidEmailCases.forEach((invalidEmail) => {
//     test(`blocks progression for invalid email: ${invalidEmail}`, async ({
//       landingFormPage,
//       submissionData,
//     }) => {
//       await landingFormPage.completeFlowBeforeContactStep(zipCodes.serviceAvailable);
//       await landingFormPage.fillName(submissionData.fullName);
//       await landingFormPage.fillEmail(invalidEmail);
//       await landingFormPage.submitContactStep();

//       await expect(landingFormPage.contactStepSubmitButton()).toBeVisible();
//       await expect(landingFormPage.phoneStepSubmitButton()).toBeHidden();
//       await expect(landingFormPage.page).not.toHaveURL(/\/thankyou$/);
//     });
//   });
// });
