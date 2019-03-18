export class ValidationData extends Error {
    constructor(message) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
    }
}
export class QeuryBuilder extends Error {
    constructor(message) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
    }
}