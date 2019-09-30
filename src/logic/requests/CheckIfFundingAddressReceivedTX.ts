import * as bodyParser from 'body-parser';
import * as express from 'express';

import { HTTPResponse } from '../../models/http_responses/httpResponse';
import { SLPHelper } from "../SLPHelper";

export class CheckIfFundingAddressReceivedTX {
    public static Execute(req: express.Request, res: express.Response) {
        const slpHelper = req.app.locals.SLPHelper as SLPHelper;

        const timeout = 10;
        let timeoutCounter = 0;

        slpHelper.GetTokenBalanceOfSLPAddress(
            req.app.locals.Config.TokenId,
            req.app.locals.Config.FundingAddress
        ).then((balance) => {
            req.app.locals.LastFundingAddressBalance = balance;
        });

        const interval = setInterval(() => {
            timeoutCounter++;
            if (timeoutCounter > timeout) {
                res.sendStatus(408);
                clearInterval(interval);
            }

            Promise.all([
                slpHelper.GetTokenBalanceOfSLPAddress(
                    req.app.locals.Config.TokenId,
                    req.app.locals.Config.FundingAddress
                ),
                slpHelper.GetLastSLPTX(
                    req.app.locals.Config.TokenId,
                    req.app.locals.Config.FundingAddress
                )
            ])
                .then(([balance, txId]) => {
                    if (balance > req.app.locals.LastFundingAddressBalance
                        && txId !== req.app.locals.LastFundingAddressTXId ) {
                        req.app.locals.LastFundingAddressBalance = balance;
                        req.app.locals.LastFundingAddressTXId = txId;
                        res.json(new HTTPResponse({
                            txId: txId
                        }));
                        clearInterval(interval);
                    }
                })
                .catch((err) => {
                    res.status(400).json(new HTTPResponse(null, err));
                    clearInterval(interval);
                });

        }, 3000);
    }
}
