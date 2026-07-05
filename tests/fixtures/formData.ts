export const interestOptions = [
  "Independence",
  "Safety",
  "Therapy",
  "Other",
] as const;
export type InterestOption = (typeof interestOptions)[number];

export const propertyTypeOptions = [
  "Owned House / Condo",
  "Rental Property",
  "Mobile Home",
] as const;
export type PropertyTypeOption = (typeof propertyTypeOptions)[number];

export type WalkInBathSubmissionData = {
  zipCode: string;
  interest: InterestOption;
  propertyType: PropertyTypeOption;
  fullName: string;
  email: string;
  phone: string;
};

export const validSubmissionData: WalkInBathSubmissionData = {
  zipCode: "68901",
  interest: "Independence",
  propertyType: "Owned House / Condo",
  fullName: "John Doe",
  email: "john.doe@example.com",
  phone: "4025551212",
};

export const zipCodes = {
  serviceAvailable: "68901",
  outOfArea: "11111",
};

export const invalidZipCodes = {
  tooShort: "1234",
  tooLong: "123456",
  nonDigit: "12a45",
};

export const invalidEmails = {
  missingAt: "invalid-email",
  missingDomain: "user@",
  missingLocalPart: "@example.com",
  doubleAt: "user@@example.com",
  withWhitespace: "user name@example.com",
  malformedDomainDots: "user@example..com",
  missingDotCom: "user@example",
};

export const invalidPhones = {
  tooShort: "987654321",
  allZeros: "0000000000",
};
