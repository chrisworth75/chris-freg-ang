# End-to-End Tests

This directory contains Playwright e2e tests for the ChrisFreg Angular application.

## Test Coverage

### Fee Management Tests (`fee-management.spec.ts`)

**Fee Creation & Tab Verification:**
- ✅ Create draft fee → verify appears in Draft tab
- ✅ Create approved fee → verify appears in Approved tab
- ✅ Create live fee → verify appears in Live tab
- ✅ Create multiple fees → verify proper tab organization
- ✅ Form validation error handling
- ✅ Duplicate fee code error handling
- ✅ Tab switching functionality

**Test Scenarios:**
1. **Individual Category Tests** - Creates one fee per status and verifies tab placement
2. **Multi-Category Test** - Creates all three statuses and verifies isolation
3. **Validation Tests** - Tests form validation and error states
4. **Duplicate Handling** - Tests duplicate fee code prevention
5. **UI Interaction** - Tests tab switching and active states

## Running Tests

**Prerequisites:**
- API must be running on `localhost:5100`
- Frontend must be running on `localhost:4200`

**Commands:**
```bash
# Run e2e tests (requires manual server start)
npm run test:e2e

# Run full e2e suite (auto-starts server)
npm run e2e

# Run specific test file
npx playwright test fee-management.spec.ts

# Run tests in headed mode (visible browser)
npx playwright test --headed

# Debug specific test
npx playwright test fee-management.spec.ts --debug
```

## Test Features

**Database Reset:**
- Each test starts with a clean database via `POST /reset-db`
- Ensures test isolation and repeatability

**API Integration:**
- Tests make real API calls through the Angular proxy
- Validates full stack integration

**UI Verification:**
- Tests actual DOM elements and CSS classes
- Verifies Bootstrap tab functionality
- Checks fee display formatting (£ symbol, status display)

**Error Handling:**
- Tests form validation states
- Verifies error messages display correctly
- Tests duplicate prevention logic

## Test Data

Tests use predictable fee codes for easy debugging:
- `DRAFT001`, `APPR001`, `LIVE001` - Single category tests
- `MULTI001-003` - Multi-category test
- `DUPLICATE001` - Duplicate testing

All tests use realistic fee amounts and descriptions.