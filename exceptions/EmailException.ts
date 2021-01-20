export default class EmailException extends Error {

    constructor() {
        super('Email is not valid')
    }

}