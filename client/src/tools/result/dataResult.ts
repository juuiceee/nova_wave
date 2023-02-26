import { ErrorData } from "./errorData";

export class DataResult<T> {
    public isSuccess = this.errors.length === 0;

    constructor(
        public data: T | null,
        public errors: ErrorData[]
    ) { }

    public static success<T>(value: T): DataResult<T> {
        return new DataResult<T>(value, []);
    }

    public static fail(errors: ErrorData[]): DataResult<null> {
        return new DataResult(null, errors);
    }

    public getErrorsString = (): string => {
        return this.errors.map(error => error.message).join('. ')
    }
}