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

  await page.getByRole('textbox', { name: 'Code' }).fill('fee002');
  await page.getByRole('spinbutton', { name: 'Amount' }).fill('200');
  await page.getByRole('textbox', { name: 'Description' }).fill('Test fee 002');
  await page.getByRole('combobox', { name: 'Status' }).selectOption('approved');

  await page.getByRole('button', { name: 'Create' }).click();

  await expect(page.getByText('Fee created successfully!')).toBeVisible();
});

test('Create fee with code fee003 (live)', async ({ page }) => {
  await page.goto('http://localhost:4200/fees');
  await page.getByRole('link', { name: 'Create Fee' }).click();

  await page.getByRole('textbox', { name: 'Code' }).fill('fee003');
  await page.getByRole('spinbutton', { name: 'Amount' }).fill('300');
  await page.getByRole('textbox', { name: 'Description' }).fill('Test fee 003');
  await page.getByRole('combobox', { name: 'Status' }).selectOption('live');

  await page.getByRole('button', { name: 'Create' }).click();

  await expect(page.getByText('Fee created successfully!')).toBeVisible();
});
