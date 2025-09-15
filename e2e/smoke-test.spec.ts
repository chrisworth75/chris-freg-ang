import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';

test.describe('Smoke Tests - Basic Connectivity', () => {

  test('should be able to reach the frontend application', async ({ page }) => {
    console.log('🌐 Testing frontend connectivity...');

    try {
      await page.goto('/');
      await page.waitForLoadState('networkidle', { timeout: 30000 });

      // Check if the page loaded
      const title = await page.title();
      console.log('📄 Page title:', title);

      // Check if Angular app is running
      await expect(page.locator('body')).toBeVisible();
      console.log('✅ Frontend is accessible and responding');

    } catch (error) {
      console.error('❌ Frontend test failed:', error);
      throw error;
    }
  });

  test('should be able to reach the API through the proxy', async ({ page }) => {
    console.log('🔗 Testing API connectivity through Angular proxy...');

    try {
      // Test API through the Angular proxy
      const response = await page.request.get('/api/fees');
      console.log('📊 API response status:', response.status());

      expect(response.status()).toBe(200);

      const data = await response.json();
      console.log('📦 API response:', data);
      console.log('✅ API is accessible through proxy');

    } catch (error) {
      console.error('❌ API test failed:', error);
      throw error;
    }
  });

  test('should load the fees page without errors', async ({ page }) => {
    console.log('📋 Testing fees page loading...');

    try {
      await page.goto('/fees');
      await page.waitForLoadState('networkidle', { timeout: 30000 });

      // Check for tab navigation
      await expect(page.locator('#draft-tab')).toBeVisible();
      await expect(page.locator('#approved-tab')).toBeVisible();
      await expect(page.locator('#live-tab')).toBeVisible();

      console.log('✅ Fees page loaded successfully with tabs');

    } catch (error) {
      console.error('❌ Fees page test failed:', error);
      throw error;
    }
  });

  test('should demonstrate video capture on failure', async ({ page }) => {
    await allure.step('📹 Starting video capture demo test', async () => {
      console.log('📹 Demonstrating video capture on test failure...');
    });

    try {
      await allure.step('🌐 Navigate to fees page', async () => {
        await page.goto('/fees');
        await page.waitForLoadState('networkidle', { timeout: 30000 });
        console.log('✅ Successfully navigated to /fees');
      });

      await allure.step('🎬 Perform user interactions for video demo', async () => {
        console.log('🎬 Performing actions that will be captured in video...');

        await allure.step('Click Draft tab', async () => {
          await page.click('#draft-tab');
          await page.waitForTimeout(1000);
          console.log('✅ Clicked Draft tab');
        });

        await allure.step('Click Approved tab', async () => {
          await page.click('#approved-tab');
          await page.waitForTimeout(1000);
          console.log('✅ Clicked Approved tab');
        });

        await allure.step('Click Live tab', async () => {
          await page.click('#live-tab');
          await page.waitForTimeout(1000);
          console.log('✅ Clicked Live tab');
        });
      });

      await allure.step('⚡ Intentionally trigger test failure', async () => {
        console.log('⚡ Intentionally failing to capture video...');
        await expect(page.locator('#non-existent-element')).toBeVisible({ timeout: 5000 });
      });

    } catch (error) {
      console.error('❌ Demo test failed as expected for video capture:', error.message);
      throw error;
    }
  });
});