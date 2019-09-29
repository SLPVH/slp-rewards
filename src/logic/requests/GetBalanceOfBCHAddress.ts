import * as bodyParser from 'body-parser';
import * as express from 'express';

import { HTTPResponse } from '../../models/http_responses/httpResponse';
import { SLPHelper } from "../SLPHelper";

export class GetBalanceOfBCHAddress {
    public static Execute(req: express.Request, res: express.Response) {
        const slpHelper = req.app.locals.SLPHelper as SLPHelper;

        if (!req.params || !req.params.address) {
            res.status(400).json(new HTTPResponse(null, 'Address not specified'));
            return;
        }

        slpHelper.GetBalanceOfBCHAddress(req.params.address)
        .then((balance) => {
            res.json(new HTTPResponse({
                balance: balance
            }));
        })
        .catch((err) => {
            res.status(400).json(new HTTPResponse(null, err));
        });
    }
}
