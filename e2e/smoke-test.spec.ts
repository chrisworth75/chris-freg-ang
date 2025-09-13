import { test, expect } from '@playwright/test';

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
});