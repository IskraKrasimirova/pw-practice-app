import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    // runs before each test and navigates to the base URL
    await page.goto('http://uitestingplayground.com/ajax');
    await page.getByText('Button Triggering AJAX Request').click();
});

test('Auto waiting 1', async ({ page }) => {
    const successButton = page.locator('.bg-success');

    await successButton.click();
});

test('Auto waiting 2', async ({ page }) => {
    const successButton = page.locator('.bg-success');
    const successText = await successButton.textContent();

    expect(successText).toEqual('Data loaded with AJAX get request.');
});

test('Auto waiting 3', async ({ page }) => {
    const successButton = page.locator('.bg-success');

    await successButton.waitFor({ state: 'attached' });
    const text = await successButton.allTextContents();

    expect(text).toContain('Data loaded with AJAX get request.');
});

test('Auto waiting 4', async ({ page }) => {
    const successButton = page.locator('.bg-success');

    await expect(successButton).toHaveText('Data loaded with AJAX get request.', { timeout: 20000 });
});

test('Alternative waits', async ({ page }) => {
    const successButton = page.locator('.bg-success');

    // 1) wait for element
    await page.waitForSelector('.bg-success');

    // // 2) wait for particular response
    // await page.waitForResponse('http://uitestingplayground.com/ajaxdata');

    // // 3) wait for network calls to be completed - NOT RECOMMENDED
    // await page.waitForLoadState('networkidle');

    const text = await successButton.allTextContents();

    expect(text).toContain('Data loaded with AJAX get request.');
});
