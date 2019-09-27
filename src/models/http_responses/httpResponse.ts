export class HTTPResponse {
    public response: object;
    public err: string;

    constructor(data: object, err: string) {
        this.response = data;
        this.err = err;
    }
}
