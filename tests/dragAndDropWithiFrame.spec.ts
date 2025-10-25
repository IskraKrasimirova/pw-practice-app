import { test, expect } from '@playwright/test';

test('Drag and Drop with iFrame', async ({ page }) => {
    test.slow();
    test.setTimeout(60000);

    await page.goto('https://www.globalsqa.com/demo-site/draganddrop/');

    const consentButton = page.getByRole('button', { name: 'Consent' });

    if (await consentButton.isVisible()) {
        console.log('✅ Consent button is visible, clicking...');
        await consentButton.click({ force: true });
    }
    //await page.getByRole('button', { name: 'Consent' }).click();

    const frame = page.frameLocator('[rel-title="Photo Manager"] iframe');
    await frame.locator('li', { hasText: 'High Tatras 2' }).dragTo(frame.locator('#trash'));

    await expect(frame.locator('#trash li')).toContainText('High Tatras 2');
    expect.soft(await frame.locator('ul #gallery li', { hasText: 'High Tatras 2' }).count()).toBe(0);

    // more precise control over drag and drop using mouse events
    await frame.locator('li', { hasText: 'High Tatras 3' }).hover();
    await page.mouse.down();
    await frame.locator('#trash').hover();
    await page.mouse.up();

    await expect(frame.locator('#trash li h5')).toHaveText(['High Tatras 2', 'High Tatras 3']);
});