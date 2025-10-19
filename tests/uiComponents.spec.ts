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