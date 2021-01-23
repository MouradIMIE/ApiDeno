export default class PasswordException extends Error {

    constructor(message:string) {
        super(message)
    }

    public static isValidPassword(password: string): boolean {
        const reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@/:.;*^$%#~!?])\S{7,20}$/
        return (reg.test(password.trim()));
    }
}