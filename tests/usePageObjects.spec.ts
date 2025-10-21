import { test, expect } from '@playwright/test';
import { NavigationPage } from '../page-objects/navigationPage';

test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200/');
});

test('navigate to Form Layouts page', async ({ page }) => {
    const navigateTo = new NavigationPage(page);
    await navigateTo.formLayoutsPage();
    await expect(page).toHaveURL('http://localhost:4200/pages/forms/layouts');

    await navigateTo.datepickerPage();
    await expect(page).toHaveURL('http://localhost:4200/pages/forms/datepicker');

    await navigateTo.toasterPage();
    await navigateTo.smartTablePage();
    await navigateTo.tooltipPage();
});