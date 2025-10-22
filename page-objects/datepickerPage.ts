import { expect, Page } from "@playwright/test";

export class DatepickerPage {

    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async selectCommonDatePickerDateFromToday(numberOfDaysFromToday: number) {
        const datepickerInputField = this.page.getByPlaceholder('Form Picker');
        await datepickerInputField.click();
        const expectedDateFormatted = await this.selectDateFromCalendar(numberOfDaysFromToday);

        await expect(datepickerInputField).toHaveValue(expectedDateFormatted);
    }

    async selectDatePickerWithRangeFromToday(startDayFromToday: number, endDayFromToday: number) {
        const datepickerInputField = this.page.getByPlaceholder('Range Picker');
        await datepickerInputField.click();
        const dateToAssertStart = await this.selectDateFromCalendar(startDayFromToday);
        const dateToAssertEnd = await this.selectDateFromCalendar(endDayFromToday);
        const expectedDateFormatted = `${dateToAssertStart} - ${dateToAssertEnd}`;

        await expect(datepickerInputField).toHaveValue(expectedDateFormatted);
    }

    private async selectDateFromCalendar(numberOfDaysFromToday: number) {
        let date = new Date();
        date.setDate(date.getDate() + numberOfDaysFromToday);

        const expectedDate = date.getDate().toString();
        const expectedMonthShort = date.toLocaleString('default', { month: 'short' });
        const expectedMonthLong = date.toLocaleString('default', { month: 'long' });
        const expectedYear = date.getFullYear();
        const expectedDateFormatted = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`;

        let calendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent();
        const expectedMonthAndYear = `${expectedMonthLong} ${expectedYear}`;

        while (!calendarMonthAndYear.includes(expectedMonthAndYear) ) {
            await this.page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click();
            calendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent();
        }

        await this.page.locator('.day-cell.ng-star-inserted:not(.bounding-month)').getByText(expectedDate, { exact: true }).click();
        return expectedDateFormatted;
    }
}