import * as bodyParser from 'body-parser';
import * as express from 'express';

import { HTTPResponse } from '../../models/http_responses/httpResponse';
import { SLPHelper } from "../SLPHelper";

export class GetTokenBalanceOfSLPAddress {
    static Execute(req: express.Request, res: express.Response) {
        const SLPHelper = req.app.locals.SLPHelper as SLPHelper;

        if (!req.params || !req.params.address || !req.params.tokenId) {
            res.status(400).json(new HTTPResponse(null, 'Address and/or Token Id not specified'));
            return;
        }
    
        Promise.all([
            SLPHelper.GetTokenBalanceOfSLPAddress(req.params.tokenId, req.params.address),
            SLPHelper.GetSLPTokenSymbol(req.params.tokenId),
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
