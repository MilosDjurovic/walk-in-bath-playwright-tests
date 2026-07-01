# walk-in-bath-playwright-tests

End-to-end Playwright test suite for the interview page at https://test-qa.capslock.global/, implemented in TypeScript.

## Tech Stack

- Playwright Test
- TypeScript
- GitHub Actions (CI)

## Setup

1. Install dependencies:

```bash
npm install
```

2. Install Playwright browsers:

```bash
npx playwright install
```

3. Run all tests:

```bash
npm test
```

4. Optional run modes:

```bash
npm run test:headed
npm run test:ui
```

5. Open HTML report after execution:

```bash
npm run test:report
```

## Project Structure

```text
.
├── .github/workflows/playwright.yml
├── tests/
│   ├── e2e/
│   │   ├── email-validation.spec.ts
│   │   ├── happy-path-available.spec.ts
│   │   ├── out-of-area.spec.ts
│   │   ├── phone-validation.spec.ts
│   │   └── required-fields.spec.ts
│   ├── fixtures/
│   │   ├── formData.ts
│   │   └── test.ts
│   └── pages/
│       └── LandingFormPage.ts
├── playwright.config.ts
├── tsconfig.json
└── package.json
```

## Test Architecture Notes

- Setup reuse is implemented with Playwright fixtures in `tests/fixtures/test.ts` via `test.extend`.
- Shared context (page object + canonical test data) is injected into tests rather than manually initialized in each spec.
- Assertions are kept in test files only.
- `LandingFormPage` contains actions and state accessors with single-responsibility methods.

## Scenarios Considered

1. Valid ZIP (service available) can complete full flow and reach Thank-you page.
2. Valid ZIP (out-of-area) follows out-of-area branch.
3. Required fields block progression when missing.
4. Email is validated with native HTML5 behavior.
5. Phone number must be exactly 10 digits to allow submission.
6. ZIP rejects invalid input (empty/incorrect values).
7. Property/interest steps require a selection before progressing.

## Selected Top 5 and Why

Implemented top 5 scenarios:

1. `happy-path-available.spec.ts`
2. `out-of-area.spec.ts`
3. `required-fields.spec.ts`
4. `email-validation.spec.ts`
5. `phone-validation.spec.ts`

Selection rationale:

- These scenarios validate the core business path and highest-risk validation gates.
- They cover both primary conversion and negative branching (out-of-area).
- They verify mandatory assignment requirements directly (ZIP branch logic, native email validation, phone constraint, required-field enforcement, thank-you redirect).

## Defects Observed

1. Out-of-area step progress indicator appears malformed.
- Expected: clear, complete progress indicator (for example, `1 of 5` or equivalent).
- Actual: indicator appears as `1 of` without total context on the out-of-area branch.
- Impact: confusing UX and inconsistent progress communication.

2. ZIP error messaging is generic for multiple invalid cases.
- Expected: specific feedback for exact-5-digit constraint.
- Actual: generic `Wrong ZIP code.` message for different invalid formats/lengths.
- Impact: users receive less actionable guidance for correction.

## CI

GitHub Actions workflow is included in `.github/workflows/playwright.yml` and runs tests on push and pull requests to `main`.

## Future Improvements (2-4)

1. Add cross-browser matrix (Firefox/WebKit) after stabilizing selectors against responsive variants.
2. Add lightweight data factories for additional edge cases (boundary ZIP/phone/email sets).
3. Add linting/formatting checks (ESLint + Prettier) in CI for stricter code quality gates.
4. Add trace-on-retry triage helper scripts for faster failure analysis.
