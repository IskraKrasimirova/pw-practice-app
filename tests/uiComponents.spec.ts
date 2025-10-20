import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    // runs before each test and navigates to the base URL
    await page.goto('http://localhost:4200/');
});

test.describe('Form Layouts page', () => {
    test.beforeEach(async ({ page }) => {
        await page.getByText('Forms').click();
        await page.getByText('Form Layouts').click();
    });

    test('input fields', async ({ page }) => {
        const usingTheGridEmailInput = page.locator('nb-card', { hasText: 'Using the Grid' }).getByRole('textbox', { name: 'Email' });

        await usingTheGridEmailInput.fill('user@user.com');
        await usingTheGridEmailInput.clear();
        await usingTheGridEmailInput.pressSequentially('user2@user.com', { delay: 500 });

        // generic assertion
        const inputValue = await usingTheGridEmailInput.inputValue();
        expect(inputValue).toEqual('user2@user.com');

        // locator assertion
        await expect(usingTheGridEmailInput).toHaveValue('user2@user.com');
    });

    test('radio buttons', async ({ page }) => {
        const usingTheGridForm = page.locator('nb-card', { hasText: 'Using the Grid' });

        //await usingTheGridForm.getByLabel('Option 1').click({force: true});
        const radioButton1 = usingTheGridForm.getByRole('radio', { name: 'Option 1' });
        await radioButton1.click({ force: true });
        const radioStatus1 = await radioButton1.isChecked();

        expect(radioStatus1).toBeTruthy();
        await expect(radioButton1).toBeChecked();

        const radioButton2 = usingTheGridForm.getByRole('radio', { name: 'Option 2' });
        await radioButton2.click({ force: true });

        expect(await radioButton1.isChecked()).toBeFalsy();
        expect(await radioButton2.isChecked()).toBeTruthy();
        await expect(radioButton2).toBeChecked();
        await expect(radioButton1).not.toBeChecked();
    });
});

test('checkboxes', async ({ page }) => {
    await page.getByText('Modal & Overlays').click();
    await page.getByText('Toastr').click();

    await page.getByRole('checkbox', { name: 'Hide on click' }).uncheck({ force: true });
    await page.getByRole('checkbox', { name: 'Show toast with icon' }).check({ force: true });

    const allCheckboxes = page.getByRole('checkbox');

    for (const box of await allCheckboxes.all()) {
        await box.check({ force: true });
        await expect(box).toBeChecked();
        expect(await box.isChecked()).toBeTruthy();
    }
});

test('lists and dropdowns', async ({ page }) => {
    const dropdownMenu = page.locator('ngx-header nb-select');
    await dropdownMenu.click();

    // page.getByRole('list') // when the list has UL tag
    // page.getByRole('listitem') // when the list has LI tag

    // const optionsList = page.getByRole('list').locator('nb-option');
    const optionsList = page.locator('nb-option-list nb-option');

    await expect(optionsList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"]);

    await optionsList.filter({ hasText: 'Cosmic' }).click();
    const header = page.locator('nb-layout-header');

    await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89)');

    const colors = {
        "Light": "rgb(255, 255, 255)",
        "Dark": "rgb(34, 43, 69)",
        "Cosmic": "rgb(50, 50, 89)",
        "Corporate": "rgb(255, 255, 255)"
    };

    await dropdownMenu.click();

    for (const color in colors) {
        await optionsList.filter({ hasText: color }).click();
        await expect(header).toHaveCSS('background-color', colors[color]);

        if (color !== 'Corporate') {
            await dropdownMenu.click();
        }
    }
});

test('tooltips', async ({ page }) => {
    await page.getByText('Modal & Overlays').click();
    await page.getByText('Tooltip').click();

    const tooltipCard = page.locator('nb-card', { hasText: 'Tooltip Placements' });
    await tooltipCard.getByRole('button', { name: 'Top' }).hover();
    // page.getByRole('tooltip'); // when the tooltip has role="tooltip"
    const tooltip = await page.locator('nb-tooltip').textContent();

    expect(tooltip).toEqual('This is a tooltip');
});

test('browser dialog boxes', async ({ page }) => {
    await page.getByText('Tables & Data').click();
    await page.getByText('Smart Table').click();

    // to accept the confirm box
    page.on('dialog', dialog => {
        expect(dialog.message()).toEqual('Are you sure you want to delete?');
        dialog.accept();
    });
    // to cancel the confirm box; by default, the dialog is dismissed
    // page.on('dialog', dialog => dialog.dismiss()); 

    await page.getByRole('table').locator('tr', { hasText: 'mdo@gmail.com' }).locator('.nb-trash').click();
    await expect(page.locator('table tr').first()).not.toHaveText('mdo@gmail.com');
});

test('regular dialog boxes', async ({ page }) => {
    await page.getByText('Modal & Overlays').click();
    await page.getByText('Dialog').click();

    await page.getByRole('button', { name: 'Open Dialog with component' }).click();
    const dialog = page.locator('nb-dialog-container');
    await expect(dialog).toHaveCount(1);
    await expect(dialog).toBeVisible();

    const dialogTitle = await dialog.locator('nb-card-header').textContent();
    const dialogText = await dialog.locator('nb-card-body').textContent();

    expect(dialogTitle).toEqual('This is a title passed to the dialog component');
    expect(dialogText).toContain('Lorem ipsum dolor sit amet');
    await expect(dialog.locator('nb-card-body')).not.toBeEmpty();

    await dialog.getByRole('button', { name: 'Dismiss Dialog' }).click();
    await expect(dialog).toHaveCount(0);
    await expect(dialog).not.toBeVisible();
});

test('web table', async ({ page }) => {
    await page.getByText('Tables & Data').click();
    await page.getByText('Smart Table').click();

    // 1. get the row by any text in this row
    const tableRow = page.getByRole('row', { name: "twitter@outlook.com" });
    await tableRow.locator('.nb-edit').click();
    await page.locator('input-editor').getByPlaceholder('Age').clear();
    await page.locator('input-editor').getByPlaceholder('Age').fill('35');
    await page.locator('.nb-checkmark').click();
    await expect(tableRow).toHaveText(/35/);

    // 2. get the row based on the value in specific column
    await page.locator('.ng2-smart-pagination-nav').getByText('2').click();
    const targetRowById = page.getByRole('row', { name: "11" }).filter({ has: page.locator('td').nth(1).getByText('11') });
    await targetRowById.locator('.nb-edit').click();
    await page.locator('input-editor').getByPlaceholder('E-mail').clear();
    await page.locator('input-editor').getByPlaceholder('mail').fill('user@user.com');
    await page.locator('.nb-checkmark').click();
    await expect(targetRowById.locator('td').nth(5)).toHaveText('user@user.com');

    // 3. test filter functionality
    const ages = ["20", "30", "40", "200"];

    for (const age of ages) {
        await page.locator('input-filter').getByPlaceholder('Age').clear();
        await page.locator('input-filter').getByPlaceholder('Age').fill(age);
        await page.waitForTimeout(500);
        const ageRows = page.locator('tbody tr');

        for (let row of await ageRows.all()) {
            const cellValue = await row.locator('td').last().textContent();

            if (age == "200") {
                expect(await page.getByRole('table').textContent()).toContain(" No data found ");
            }
            else {
                expect(cellValue).toEqual(age);
            }
        }
    }
});

test('datepicker', async ({ page }) => {
    await page.getByText('Forms').click();
    await page.getByText('Datepicker').click();

    const datepickerInputField = page.getByPlaceholder('Form Picker');
    await datepickerInputField.click();

    let date = new Date();
    date.setDate(date.getDate() + 7); // set date 7 days in the future

    const expectedDate = date.getDate().toString();
    const expectedMonthShort = date.toLocaleString('default', { month: 'short' });
    const expectedMonthLong = date.toLocaleString('default', { month: 'long' });
    const expectedYear = date.getFullYear();
    const expectedDateFormatted = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`;

    let calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent();
    const expectedMonthAndYear = `${expectedMonthLong} ${expectedYear}`;

    while (calendarMonthAndYear?.trim() !== expectedMonthAndYear) {
        await page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click();
        calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent();
    }

    await page.locator('[class="day-cell ng-star-inserted"]').getByText(expectedDate, { exact: true }).click();

    await expect(datepickerInputField).toHaveValue(expectedDateFormatted);
});