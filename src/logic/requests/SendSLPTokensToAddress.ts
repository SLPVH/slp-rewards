import * as bodyParser from 'body-parser';
import * as express from 'express';

import { HTTPResponse } from '../../models/http_responses/httpResponse';
import { SLPHelper } from "../SLPHelper";

export class SendSLPTokensToAddress {
    public static Execute(req: express.Request, res: express.Response) {
        const slpHelper = req.app.locals.SLPHelper as SLPHelper;

        if (!req.params || !req.params.address || !req.body
            || !req.body.dollarAmount || typeof req.body.dollarAmount !== 'number') {
            res.status(400).json(new HTTPResponse(null, 'Address and/or Amount not specified'));
            return;
        }

        // Convert dollar amount to tokens
        const tokenAmount = slpHelper.DollarToTokenConversion(
            req.body.dollarAmount,
            req.app.locals.Config.tokensPerDollar
        );

        slpHelper.SendSLPTokensToAddress(
            req.app.locals.Config.FundingAddress,
            req.app.locals.Config.FundingWif,
            req.params.address,
            req.app.locals.Config.TokenId,
            tokenAmount)
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
