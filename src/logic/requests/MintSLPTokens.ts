import * as bodyParser from 'body-parser';
import * as express from 'express';

import { HTTPResponse } from '../../models/http_responses/httpResponse';
import { SLPHelper } from "../SLPHelper";

export class MintSLPTokens {
    public static Execute(req: express.Request, res: express.Response) {
        const slpHelper = req.app.locals.SLPHelper as SLPHelper;

        if (!req.body || !req.body.amount || typeof req.body.amount !== 'number') {
            res.status(400).json(new HTTPResponse(null, 'Amount not specified'));
            return;
        }

        slpHelper.MintSLPTokens(
            req.app.locals.Config.FundingAddress,
            req.app.locals.Config.FundingWif,
            req.app.locals.Config.TokenId,
            req.body.amount)
        .then((txId) => {
            res.json(new HTTPResponse({
                txId: txId
            }));
        })
        .catch((err) => {
            res.status(400).json(new HTTPResponse(null, err));
        });
    }
}
