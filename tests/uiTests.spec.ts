import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    // runs before each test and navigates to the base URL
    await page.goto('http://localhost:4200/');
    await page.getByText('Forms').click();
    await page.getByText('Form Layouts').click();
});

test('Locator syntax rules', async ({ page }) => {
    // by Tag Name
    await page.locator('input').first().click();

    // // by ID
    // await page.locator('#inputEmail1').click(); // id should be unique

    // // by Class Name
    // await page.locator('.input-full-width').click();    // class name can be same for multiple elements

    // // by Class full value
    // await page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition cdk-focused cdk-mouse-focused"]').click();    // class name can be same for multiple elements

    // // by Attribute
    // await page.locator('[placeholder="Email"]').click();    // can be same for multiple elements

    // // by Attribute with value
    // await page.locator('[placeholder="Email"][type="email"]').click(); // can be same for multiple elements but more specific

    // // by Multiple Attributes
    // await page.locator('[placeholder="Email"][type="email"][fullwidth]').click(); // can be same for multiple elements but more specific

    // // by Tag Name and Attribute
    // await page.locator('input[placeholder="Email"]').click();   // can be same for multiple elements but more specific

    // // by Tag Name, Class and Attribute
    // await page.locator('input.input-full-width[placeholder="Email"]').click(); // can be same for multiple elements but more specific 

    // // by XPath
    // await page.locator('//*[@id="inputEmail1"]').click(); // can be same for multiple elements but more specific

    // // by partial text match
    // await page.locator(':text("Using")').click(); // can be same for multiple elements but more specific

    // // by exact text match
    // await page.locator(':text("Using the Grid")').click(); // can be same for multiple elements but more specific

    // // by text with Tag Name
    // await page.locator('nb-card :text("Using the Grid")').click(); // can be same for multiple elements but more specific   
});

test('User facing locators', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Email' }).first().click();
    await page.getByRole('button', { name: 'Sign in' }).first().click();

    await page.getByLabel('Email').first().click();
    await page.getByPlaceholder('Jane Doe').click();
    await page.getByText('Using the Grid').click();
    await page.getByTitle('IoT Dashboard').click();
    await page.getByTestId('SignIn').click();
});

test('locating child elements', async ({ page }) => {
    // locating child element using ' ' (space)
    await page.locator('nb-card nb-radio :text-is("Option 1")').click();

    // chain of locators
    await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 2")').click();

    // locating child element using combination of general locator and user facing locator
    await page.locator('nb-card').getByRole('button', { name: 'Sign in' }).first().click();

    // locating child element using nth -> 4th element from the list
    await page.locator('nb-card').nth(3).getByRole('button').click();
});

test('locating parent elements', async ({ page }) => {
    await page.locator('nb-card', { hasText: "Using the Grid" }).getByRole('textbox', { name: 'Email' }).click();
    await page.locator('nb-card', { has: page.locator('#inputEmail1') }).getByRole('textbox', { name: 'Email' }).click();

    await page.locator('nb-card').filter({ hasText: 'Basic form' }).getByRole('textbox', { name: 'Email' }).click();
    await page.locator('nb-card').filter({ has: page.locator('.status-danger') }).getByRole('textbox', { name: 'Password' }).click();

    await page.locator('nb-card').filter({ has: page.locator('nb-checkbox') }).filter({ hasText: 'Sign in' }).getByRole('textbox', { name: 'Email' }).click();

    await page.locator(':text-is("Using the Grid")').locator('..').getByRole('textbox', { name: 'Email' }).click();
});

test('Reusing the locators', async ({ page }) => {
    const basicForm = page.locator('nb-card').filter({ hasText: 'Basic form' });
    const emailField = basicForm.getByRole('textbox', { name: 'Email' });
    const passwordField = basicForm.getByRole('textbox', { name: 'Password' });

    await emailField.fill("user@user.com");
    await passwordField.fill("Secret123");
    await basicForm.locator('nb-checkbox').click();
    await basicForm.getByRole('button').click();

    await expect(emailField).toHaveValue('user@user.com');
    await expect(passwordField).toHaveValue('Secret123');
    await expect(basicForm.locator('nb-checkbox').locator('[class="custom-checkbox checked"]')).toBeChecked();
});

test('Extracting values', async ({ page }) => {
    // single text value
    const basicForm = page.locator('nb-card').filter({ hasText: 'Basic form' });
    const buttonText = await basicForm.getByRole('button').textContent();
    expect(buttonText).toEqual('Submit')

    // all text values
    const allRadioButtonLabels = await page.locator('nb-radio').allTextContents();
    expect(allRadioButtonLabels).toEqual(['Option 1', 'Option 2', 'Disabled Option']);
    expect(allRadioButtonLabels.length).toBe(3);
    expect(allRadioButtonLabels).toContain('Option 2');

    // input field value
    const emailField = basicForm.getByRole('textbox', { name: 'Email' });
    await emailField.fill("user@user.com");
    const emailValue = await emailField.inputValue();
    expect(emailValue).toEqual("user@user.com");

    // attribute value
    const placeholderValue = await emailField.getAttribute('placeholder');
    expect(placeholderValue).toEqual('Email');
});