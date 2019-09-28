import * as bodyParser from 'body-parser';
import * as express from 'express';

import { HTTPResponse } from '../../models/http_responses/httpResponse';
import { SLPHelper } from "../SLPHelper";

export class CheckIfFundingAddressReceivedTX {
    static Execute(req: express.Request, res: express.Response) {
        const SLPHelper = req.app.locals.SLPHelper as SLPHelper;

        const timeout = 30;
        let timeoutCounter = 0;

        const interval = setInterval(function(){
            timeoutCounter++;
            if (timeoutCounter > timeout)
            {
                res.sendStatus(408);
                clearInterval(interval);
            }

            SLPHelper.GetLastTX(req.app.locals.Config.FundingAddress)
                .then((txId) => {
                    if (txId != req.app.locals.LastTXFundingAddress) {
                        req.app.locals.LastTXFundingAddress = txId;
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

        }, 1000);
    }
}
