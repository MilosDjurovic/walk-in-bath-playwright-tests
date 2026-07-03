export type WalkInBathSubmissionData = {
  zipCode: string;
  interest: 'Independence' | 'Safety' | 'Therapy' | 'Other';
  propertyType: 'Owned House / Condo' | 'Rental Property' | 'Mobile Home';
  fullName: string;
  email: string;
  phone: string;
};

export const validSubmissionData: WalkInBathSubmissionData = {
  zipCode: '68901',
  interest: 'Independence',
  propertyType: 'Owned House / Condo',
  fullName: 'John Doe',
  email: 'john.doe@example.com',
  phone: '4025551212',
};

export const zipCodes = {
  serviceAvailable: '68901',
  outOfArea: '11111',
  invalidTooShort: '1234',
  invalidTooLong: '123456',
  invalidNonDigit: '12a45',
};

export const invalidEmails = {
  missingAt: 'invalid-email',
  missingDomain: 'user@',
};

export const invalidPhones = {
  tooShort: '123456789',
  tooLong: '12345678901',
  withLetters: '12345abcde',
};
