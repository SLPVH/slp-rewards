import * as bodyParser from 'body-parser';
import * as express from 'express';

import { HTTPResponse } from '../../models/http_responses/httpResponse';
import { SLPHelper } from "../SLPHelper";
import fs from 'fs';

export class CreateSLPToken {
    public static Execute(req: express.Request, res: express.Response) {
        const slpHelper = req.app.locals.SLPHelper as SLPHelper;

        if (!req.body || !req.body.decimals || typeof req.body.decimals !== 'number'
            || !req.body.name || typeof req.body.name !== 'string'
            || !req.body.symbol || typeof req.body.symbol !== 'string'
            || typeof req.body.documentUri !== 'string'
            || typeof req.body.documentHash !== 'string'
            || !req.body.amount || typeof req.body.amount !== 'number'
            || !req.body.tokensPerDollar || typeof req.body.tokensPerDollar !== 'number') {
            res.status(400).json(new HTTPResponse(
                null, 'Decimals, Name, Symbol, DocumentURI, DocumentHash, Amount, and/or TokensPerDollar not specified'
            ));
            return;
        }

        slpHelper.CreateSLPToken(
            req.app.locals.Config.FundingAddress,
            req.app.locals.Config.FundingWif,
            req.body.decimals,
            req.body.name,
            req.body.symbol,
            req.body.documentUri,
            req.body.documentHash,
            req.body.amount)
        .then((tokenId) => {
            req.app.locals.Config.TokenId = tokenId;
            req.app.locals.Config.TokensPerDollar = req.body.tokensPerDollar;
            fs.writeFileSync('config.json', JSON.stringify(req.app.locals.Config, null, 4));

            res.json(new HTTPResponse({
                tokenId: tokenId
            }));
        })
        .catch((err) => {
            res.status(400).json(new HTTPResponse(null, err));
        });
    }
}
