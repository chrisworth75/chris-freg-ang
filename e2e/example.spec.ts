import { test, expect } from '@playwright/test';

test.beforeAll(async ({ request }) => {
  // Clear fees before each test to avoid conflicts
  const response = await request.post('http://localhost:5100/reset-db');
  console.log('Database reset response:', response.status());
});

test('Create fee with code fee001 (draft)', async ({ page }) => {
  await page.goto('http://localhost:4200/fees');
  await page.getByRole('link', { name: 'Create Fee' }).click();

  await page.getByRole('textbox', { name: 'Code' }).fill('fee001');
  await page.getByRole('spinbutton', { name: 'Amount' }).fill('100');
  await page.getByRole('textbox', { name: 'Description' }).fill('Test fee 001');
  await page.getByRole('combobox', { name: 'Status' }).selectOption('draft');

  await page.getByRole('button', { name: 'Create' }).click();

  // Verify success by checking navigation or visible text
  await expect(page.getByText('Fee created successfully!')).toBeVisible();
});

test('Create fee with code fee002 (approved)', async ({ page }) => {
  await page.goto('http://localhost:4200/fees');
  await page.getByRole('link', { name: 'Create Fee' }).click();

  // Fill form fields using ID selectors and trigger validation
  await page.fill('#code', 'fee002');
  await page.fill('#value', '200');
  await page.fill('#description', 'Test fee 002');
  await page.selectOption('#status', 'approved');

  // Wait for form to become valid and button to be enabled
  await page.waitForFunction(() => {
    const button = document.querySelector('button[type="submit"]') as HTMLButtonElement;
    return button && !button.disabled;
  });

  await page.getByRole('button', { name: 'Create' }).click();

  await expect(page.getByText('Fee created successfully!')).toBeVisible();
});

test('Create fee with code fee003 (live)', async ({ page }) => {
  await page.goto('http://localhost:4200/fees');
  await page.getByRole('link', { name: 'Create Fee' }).click();

  // Fill form fields using ID selectors and trigger validation
  await page.fill('#code', 'fee003');
  await page.fill('#value', '300');
  await page.fill('#description', 'Test fee 003');
  await page.selectOption('#status', 'live');

  // Wait for form to become valid and button to be enabled
  await page.waitForFunction(() => {
    const button = document.querySelector('button[type="submit"]') as HTMLButtonElement;
    return button && !button.disabled;
  });

  await page.getByRole('button', { name: 'Create' }).click();

  await expect(page.getByText('Fee created successfully!')).toBeVisible();
});
