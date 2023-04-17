export class RequestError extends Error {
    public readonly responseBody: string;

    public constructor(statusText: string, responseBody: string) {
        super(statusText);
        this.responseBody = responseBody;
    }
}
