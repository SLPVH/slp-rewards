import * as bodyParser from 'body-parser';
import * as express from 'express';

import { HTTPResponse } from '../../models/http_responses/httpResponse';
import { SLPHelper } from "../SLPHelper";

export class GetTokenBalanceOfSLPAddress {
    static Execute(req: express.Request, res: express.Response) {
        const SLPHelper = req.app.locals.SLPHelper as SLPHelper;

        if (!req.params || !req.params.address) {
            res.status(400).json(new HTTPResponse(null, 'Address not specified'));
            return;
        }
    
        Promise.all([
            SLPHelper.GetTokenBalanceOfSLPAddress(req.app.locals.Config.TokenId, req.params.address),
            SLPHelper.GetSLPTokenSymbol(req.app.locals.Config.TokenId),
        ])
        .then(([balance, symbol]) => {
            res.json(new HTTPResponse({
                balance: balance,
                symbol: symbol
            }));
        })
        .catch((err) => {
            res.status(400).json(new HTTPResponse(null, err));
        });
    }
}
