import { HTTPResponse } from "../models/http_responses/httpResponse";

export const Error = {
    Return400: (err: string) => {
        return new HTTPResponse(null, err);
    }
};
