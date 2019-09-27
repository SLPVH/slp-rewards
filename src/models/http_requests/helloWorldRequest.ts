import { InvalidParametersError } from "../InvalidParametersError";

export class HelloWorldRequest {
    public data: object;

    constructor(obj: any) {
        // Data validation
        const valid = typeof obj.data === 'string';
        if (!valid) {
            throw new InvalidParametersError('Invalid Parameters');
        }

        this.data = obj.data;
    }
}
