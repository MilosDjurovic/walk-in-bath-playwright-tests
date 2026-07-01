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
  invalidLength: '123456',
};

export const invalidEmails = {
  missingAt: 'invalid-email',
};

export const invalidPhones = {
  tooShort: '123456789',
  withLetters: '12345abcde',
};
