// Import Node modules

console.log('Starting Rewards Server...');

import * as bodyParser from 'body-parser';

import { CheckIfFundingAddressReceivedTX } from './logic/requests/CheckIfFundingAddressReceivedTX';
import { GetBalanceOfBCHAddress } from './logic/requests/GetBalanceOfBCHAddress';
import { GetTokenBalanceOfSLPAddress } from './logic/requests/GetTokenBalanceOfSLPAddress';
import { HTTPResponse } from './models/http_responses/httpResponse';
import { HelloWorldRequest } from './models/http_requests/helloWorldRequest';
import { InvalidParametersError } from './models/InvalidParametersError';
import { SLPHelper } from './logic/SLPHelper';
import { SendSLPTokensToAddress } from './logic/requests/SendSLPTokensToAddress';
import express from 'express';
import fs from 'fs';

// Setup basic HTTP server on port
const app = express();

// Load config
app.locals.Config = JSON.parse(fs.readFileSync('config.json').toString());

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Parse application/json
app.use(bodyParser.json());

// Attempt to connect to Bitcoin REST API
console.log(`Attempting to connect to Bitcoin REST API at '${app.locals.Config.RestURL}'...`);
try {
    app.locals.SLPHelper = new SLPHelper(app.locals.Config.RestURL);
    console.log('Success!');
} catch (ex) {
    console.error('Server cannot start, could not connect to Bitcoin REST API');
    throw ex;
}

// Track the last TX for demo purposes
app.locals.SLPHelper.GetLastTX(app.locals.Config.FundingAddress)
    .then((txId) => {
        app.locals.LastTXFundingAddress = txId;
    })
    .catch((err) => {
        throw new Error(err.message);
    });

// Static frontend site
app.use(express.static('src/web'));

// Specify routes
// Get BCH balance of address
app.get('/v1/address/:address/balance', (req, res) => {
    GetBalanceOfBCHAddress.Execute(req, res);
});

// Get SLP token balance of address
app.get('/v1/address/:address/token/balance', (req, res) => {
    GetTokenBalanceOfSLPAddress.Execute(req, res);
});

// Send SLP tokens to an address
app.post('/v1/address/:address/token/send', (req, res) => {
    SendSLPTokensToAddress.Execute(req, res);
});

// Check if funding address has received a new TX
app.get('/v1/funding/tx/check', (req, res) => {
    CheckIfFundingAddressReceivedTX.Execute(req, res);
});

// Check conversion of dollars to token amount
app.get('/v1/dollarAmount/:dollarAmount/tokens', (req, res) => {
    res.json(new HTTPResponse({
        amount: parseFloat(req.params.dollarAmount) * req.app.locals.Config.tokensPerDollar,
    }));
});

// Hello world GET and POST tests
app.post('/postTest', (req, res) => {
    let request: HelloWorldRequest;

    // Parse request and run logic
    try {
        request = new HelloWorldRequest(req.body);
        res.json(new HTTPResponse({
            Foo: request.data,
        }, null));
    } catch (ex) {
        if (ex instanceof InvalidParametersError) {
            res.status(400).json(new HTTPResponse(null, ex.message));
        }
    }
});

// Root GET request for a 'Hello World' test
app.get('/', (req, res) => {
    res.json(new HTTPResponse({
        HelloWorld: 'Rewards server up and running...',
    }, null));
});

// Starts server with routes/port specified
app.listen(app.locals.Config.Port, (err) => {
  if (err) {
    return console.error(`Error starting server: ${err}`);
  }
  return console.log(`Server is running and listening on ${app.locals.Config.Port}...`);
});
