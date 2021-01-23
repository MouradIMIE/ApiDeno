
export default class CardException extends Error {

    private static MonthSize: number = 2;
    private static YearSize: number = 2;

    constructor(message: string) {
        super(message)
    }

    static checkCard(cartNumber: string): boolean {
        const reg = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|(222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11}|62[0-9]{14})$/
        return (reg.test(cartNumber.trim()))
    }
    public static isValidMonth(month: string): boolean {
        return month.length <= this.MonthSize;
    }
    public static isValidYear(year: string): boolean {
        return year.length <= this.YearSize;
    }
}