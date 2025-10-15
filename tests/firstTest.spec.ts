import { test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    // runs before each test and navigates to the base URL
    await page.goto('http://localhost:4200/');
});

test.describe('grouped tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.getByText('Forms').click();
    });

    test('first test', async ({ page }) => {
        await page.getByText('Form Layouts').click();
    });

    test('navigate to datepicker page', async ({ page }) => {
        await page.getByText('Datepicker').click();
    });
});

test.describe('grouped tests2', () => {
    test.beforeEach(async ({ page }) => {
        await page.getByText('Charts').first().click();
    });

    test('second test', async ({ page }) => {
        await page.getByText('Echarts').click();
    });

    test('third test', async ({ page }) => {
        await page.getByText('Echarts').click();
        await page.getByText('Pie').click();
    });
});