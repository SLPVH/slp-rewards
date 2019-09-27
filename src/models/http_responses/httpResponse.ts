export class HTTPResponse {
    public response: object;
    public err: string;

    constructor(data: object, err: string = null) {
        this.response = data;
        this.err = err;
    }
}
