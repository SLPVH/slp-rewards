export class HelloWorldRequest {
    public echo: string;

    constructor(obj: any) {
        const valid = typeof obj.echo === 'string';
        if (!valid) {
            throw new TypeError('Bad Parameters');
        }

        this.echo = obj.echo;
    }
}
