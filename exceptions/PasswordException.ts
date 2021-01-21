export default class PasswordException extends Error {

    private static MIN_PASS_SIZE: number = 6;

    constructor(message:string) {
        super(message)
    }

    public static isValidPassword(password: string): boolean {
        return password.length >= this.MIN_PASS_SIZE;
    }
}