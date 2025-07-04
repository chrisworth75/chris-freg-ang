import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:4200/fees');
  await page.getByRole('link', { name: 'Create Fee' }).click();
  await page.getByRole('textbox', { name: 'Code' }).click();
  await page.getByRole('textbox', { name: 'Code' }).fill('FEE668');
  await page.getByText('CodeAmountStatusSelect a').click();
  await page.getByRole('spinbutton', { name: 'Amount' }).click();
  await page.getByRole('spinbutton', { name: 'Amount' }).fill('668');
  await page.getByLabel('Status').selectOption('approved');
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'Create' }).click();
  await page.getByRole('link', { name: 'Fees' }).click();
  await page.getByRole('tab', { name: 'Approved' }).click();
  await page.getByText('Value: £668.00').click();
});
