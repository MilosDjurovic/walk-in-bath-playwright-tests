# walk-in-bath-playwright-tests

End-to-end Playwright test suite for the interview page at https://test-qa.capslock.global/, implemented in TypeScript.

Default base URL can be overridden with `PLAYWRIGHT_BASE_URL`.

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

5. Optional: randomize generated fixture data (interest/property/email/phone):

```bash
PLAYWRIGHT_RANDOMIZE_DATA=true npm test
```

6. Optional: run against a different environment:

```bash
PLAYWRIGHT_BASE_URL=https://your-env.example.com npm test
```

7. Open HTML report after execution:

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
│   │   ├── helpers/
│   │   │   └── landingFormFlowHelpers.ts
│   │   ├── service-available-submission.spec.ts
│   │   ├── out-of-area.spec.ts
│   │   ├── phone-validation.spec.ts
│   │   ├── required-fields-and-recovery.spec.ts
│   │   └── zip-validation.spec.ts
│   ├── fixtures/
│   │   ├── formData.ts
│   │   └── testFixtures.ts
│   └── pages/
│       └── LandingFormPage.ts
├── playwright.config.ts
├── tsconfig.json
└── package.json
```

## Test Architecture Notes

- Setup reuse is implemented with Playwright fixtures in `tests/fixtures/testFixtures.ts` via `test.extend`.
- Shared context (page object + canonical test data) is injected into tests rather than manually initialized in each spec.
- Fixture data is deterministic by default for reproducible failures; randomized fixture values are available via `PLAYWRIGHT_RANDOMIZE_DATA=true` when broader coverage is needed.
- Shared flow helpers in `tests/e2e/helpers/landingFormFlowHelpers.ts` standardize repeated multi-step navigation and masked phone typing to reduce duplication and flaky input behavior, while assertions remain in specs for readability.
- Assertions are kept in test files only.
- `LandingFormPage` contains actions and state accessors with single-responsibility methods.
- In transition-sensitive checks, short stabilization waits are used inside `expectStableStepIdentity` in `tests/e2e/helpers/landingFormFlowHelpers.ts` to avoid false positives caused by transient UI frames.
- Playwright currently runs a single `chromium` project (configured in `playwright.config.ts`).

## Scenarios Considered

1. Valid ZIP (service available) can complete full flow and reach Thank-you page.
2. Valid ZIP (out-of-area) follows out-of-area branch.
3. Required fields block progression when missing.
4. Email is validated with native HTML5 behavior.
5. Phone number must be exactly 10 digits to allow submission.
6. ZIP rejects invalid input (empty/incorrect values).
7. Property/interest steps require a selection before progressing.
8. Duplicate form entry points should keep users in a consistent on-page context.

## Selected Top 5 and Why

Implemented top 5 scenarios:

1. `service-available-submission.spec.ts`
2. `out-of-area.spec.ts`
3. `required-fields-and-recovery.spec.ts`
4. `email-validation.spec.ts`
5. `phone-validation.spec.ts`

Additional implemented guardrail scenario:

6. `zip-validation.spec.ts` (grouped ZIP-step coverage for both required and exact-5-digit validation)

Optional defect-focused regression scenarios can be added later (for example, for bug #10).

Selection rationale:

- These scenarios validate the core business path and highest-risk validation gates.
- They cover both primary conversion and negative branching (out-of-area).
- They verify mandatory assignment requirements directly (ZIP branch logic, native email validation, phone constraint, required-field enforcement, thank-you redirect).

## Defects Observed

1. Out-of-area step progress indicator appears malformed.

- Expected: the out-of-area flow should either display a clear and complete progress indicator, such as `1 of 5` or an equivalent format, or omit the progress indicator entirely if it is not relevant to this branch of the flow.
- Actual: the progress indicator appears as `1 of`, without the total number of steps or any clear context, on the out-of-area branch.
- Impact: this creates a confusing and inconsistent user experience, as users may not understand where they are in the flow or whether additional steps are expected.
- Note: the presence of the step progress indicator and progress bar appears unnecessary in this flow. After the out-of-area result, the only remaining action for the user is to enter their email and receive a confirmation message that they will be notified when services become available in their area. The malformed progress indicator and progress bar are also displayed on that confirmation step, which further reinforces the inconsistency.

2. ZIP error messaging is generic for multiple invalid cases.

- Expected: specific feedback for exact-5-digit constraint.
- Actual: generic `Wrong ZIP code.` message for different invalid formats/lengths.
- Impact: users receive less actionable guidance for correction.

3. Out-of-area notify-by-email error messaging is generic for multiple invalid cases.

- Expected: specific feedback for each invalid case, like in step 4 of the happy path.
- Actual: generic `Wrong email.` message for different invalid formats.
- Impact: users receive less actionable guidance for correction.

4. Interest step allows progression without a required selection.

- Expected: the flow should remain on the interest step until one or more options are selected.
- Actual: the form advances to the property step after clicking Next with no interest selected.
- Impact: invalid partial submissions can progress through the funnel, weakening required-field enforcement.

5. Phone step accepts (000)000-0000 submission.

- Expected: the phone field should reject invalid placeholder patterns like (000)000-0000 or numbers starting with 0. The system must keep the user on the phone step with a clear validation error until a structurally valid 10-digit number is provided.
- Actual: entering a 10-digit value comprised entirely of zeros bypasses validation, allowing the user to successfully progress past the phone step.
- Impact: invalid, non-routable phone data enters the database, severely reducing lead quality, wasting sales team resources, and breaking the core business rule for phone entry.

6. Progress UI is not consistently synchronized with the user’s current step.

- Expected: when the user progresses through the form, both the step progress indicator and the progress bar should update consistently to reflect the user’s current step. For example, progressing to Step 3 should display `3 of 5` and visually reflect Step 3 progress, while progressing to Step 4 should visually reflect Step 4 progress.
- Actual: the progress UI does not consistently update after step transitions. After progressing from Step 2 to Step 3, the step progress indicator still displays `2 of 5`, and the progress bar remains at the Step 2 state. After progressing from Step 3 to Step 4, the progress bar visually reflects the Step 3 state instead of Step 4.
- Impact: this creates a mismatch between the user’s actual position in the form and the visual progress feedback. Users may think they have not successfully advanced, which can reduce confidence in the form flow, create uncertainty about whether the previous step was completed correctly, and potentially increase form abandonment.

7. Some images in review comments cannot be opened.

- Expected: when the user clicks an image within a review comment, the image should open successfully in the image viewer.
- Actual: some review images do not open in the image viewer. For example, the image attached to Denny’s review cannot be opened.
- Impact: this prevents users from viewing potentially relevant visual information included in customer reviews. It may reduce trust in the review section, create frustration, and negatively affect the user’s ability to make an informed decision based on available customer feedback.

8. Bath walls section displays a limited and repetitive set of options.

- Expected: the Bath Walls section should display a variety of available colors and patterns, allowing users to personalize their bath according to their preferences.
- Actual: although 12 tiles are displayed, only 2 unique options are shown: White and Biscuit. Each option is repeated multiple times instead of showing a broader range of available colors or patterns.
- Impact: this limits the user’s ability to explore personalization options and may make the product offering appear less flexible than intended. It can also create confusion, as users may assume that only two bath wall options are available, which could reduce engagement and negatively affect purchase interest.

9. “Our Price Promise” section title contains a spelling error.

- Expected: the section title should be spelled correctly as `Our Price Promise`.
- Actual: the section title is displayed as `Our Price Promice`.
- Impact: this spelling error may make the page appear less polished and less professional. Since this section is related to pricing and trust, the typo could slightly reduce user confidence in the credibility of the offer and the overall quality of the website.

10. Duplicate multi-step forms are coupled and behave inconsistently across page positions.

- Expected: if two multi-step forms are displayed on the same page, each instance should either be fully independent or clearly presented as a single synchronized form experience with consistent behavior regardless of where the user starts.
- Actual: inputs and progression state are mirrored between the middle and bottom forms (changes in one are reflected in the other). Additionally, when starting from the bottom form at Step 1 and clicking Next, the page auto-scrolls to the middle form. This auto-scroll does not occur in the reverse direction and does not occur for subsequent steps.
- Impact: this creates a confusing and inconsistent experience, can make users think context has changed unexpectedly, and increases risk of funnel tracking ambiguity because interactions are split between two visible instances of the same flow.

11. Email step accepts missing top-level-domain submissions (for example, test@test and user@example).

- Expected: the email field must validate the standard structure of an email address, requiring a valid domain suffix (e.g., .com, .org, .net). Entering an address missing a top-level domain should display a validation error and keep the user on the step until corrected.
- Actual: entering incomplete email formats missing a top-level domain (for example, test@test and user@example) bypasses validation, allowing the user to successfully progress past the email step.
- Impact: broken and unroutable email addresses enter the database, causing immediate bounce-backs, skewing email marketing metrics, and degrading overall lead quality.

12. Phone input allows typing from any cursor position.

- Expected: phone number entry should be constrained to a consistent left-to-right input flow, with digits entered from the beginning of the field.
- Actual: user can click anywhere inside the phone field and start entering numbers from that selected index onward.
- Impact: this can lead to confusing input behavior, incomplete or incorrectly positioned phone numbers, and higher risk of users entering invalid data without immediately understanding why.

13. Location messaging is inconsistent across the landing page.

- Expected: location-specific content should be consistent across the page and aligned with the service area being promoted.
- Actual: the page displays different location references in separate sections, such as Vienna/Belgrade (in user location) and Michigan.
- Impact: inconsistent location messaging may confuse users about where the service is actually available. Since the form uses ZIP code to determine service availability, conflicting location references could reduce trust and make the offer feel less accurate or less localized.

## CI

GitHub Actions workflow is included in `.github/workflows/playwright.yml` and runs tests on push and pull requests to `main`.
You can also run it manually from **Actions -> Playwright Tests -> Run workflow** and provide any branch, tag, or commit SHA in the `branch` input.

## Future Improvements (Top 4 Prioritized)

From the proposed improvement candidates, the following 4 are the most relevant for this project right now based on delivery impact, CI safety, and maintainability:

1. **Smoke suite as a PR gate**

Run smoke tests automatically on pull requests and block merges when critical scenarios fail.

2. **Test tagging**

Add tags such as `@smoke`, `@regression`, and `@critical` to support targeted test execution and make PR/scheduled pipelines practical.

3. **Scheduled test runs**

Configure scheduled smoke and regression runs to detect regressions outside active development windows.

4. **API-level coverage where possible**

Move suitable validations from UI tests to API checks to reduce execution time and improve test stability.

Prioritization rationale:

- Items 1-3 work together as an immediate quality gate strategy (selection + trigger + enforcement).
- Item 4 improves long-term speed and reliability by reducing dependence on slower, more brittle UI flows.
