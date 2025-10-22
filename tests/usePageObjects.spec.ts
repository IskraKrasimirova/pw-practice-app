import { test, expect } from '@playwright/test';
import { PageManager } from '../page-objects/pageManager';

test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200/');
});

test('navigate to Form Layouts page', async ({ page }) => {
    const pm = new PageManager(page);
    await pm.navigateTo().formLayoutsPage();
    await expect(page).toHaveURL('http://localhost:4200/pages/forms/layouts');

    await pm.navigateTo().datepickerPage();
    await expect(page).toHaveURL('http://localhost:4200/pages/forms/datepicker');

    await pm.navigateTo().toasterPage();
    await pm.navigateTo().smartTablePage();
    await pm.navigateTo().tooltipPage();
});

test('parametrized methods', async ({ page }) => {
    const pm = new PageManager(page);

    await pm.navigateTo().formLayoutsPage();
    await pm.onFormLayoutsPage().submitUsingTheGridFormWithCredentialsAndOption('user@user.com', 'Secret123', 'Option 1');
    await pm.onFormLayoutsPage().submitInlineFormWithNameEmailAndCheckbox('John Smith', 'user2@user.com', true);

    await pm.navigateTo().datepickerPage();
    await pm.onDatePickerPage().selectCommonDatePickerDateFromToday(10);
    await pm.onDatePickerPage().selectDatePickerWithRangeFromToday(6, 15);
});