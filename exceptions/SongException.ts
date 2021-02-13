export default class SongException extends Error {

    constructor(message: string) {
        super(message)
    }

    static checkTime(time: string): boolean {
        const reg = /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9]):([0-5]?[0-9])$/
        return (reg.test(time.trim()))
    }
}