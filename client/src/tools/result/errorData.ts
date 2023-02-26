export class ErrorData {
    constructor(
        public key: string | null,
        public message: string) {
    }
}

export const mapToErrorData = (errors: any[]): ErrorData[] => {
    return errors.map(error => new ErrorData(
        error.Key ? error.Key : error.key,
        error.Message ? error.Message : error.message)
    );
};