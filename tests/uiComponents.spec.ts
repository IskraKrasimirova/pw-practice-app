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