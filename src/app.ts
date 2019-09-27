// Import Node modules

import * as bodyParser from 'body-parser';

import { HTTPResponse } from './models/http_responses/httpResponse';
import { HelloWorldRequest } from './models/http_requests/helloWorldRequest';
import { InvalidParametersError } from './models/InvalidParametersError';
import express from 'express';
import fs from 'fs';

// Load config
// Port = the port to run the server on
const config = JSON.parse(fs.readFileSync('config.json').toString());

// Setup basic HTTP server on port
const app = express();

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Parse application/json
app.use(bodyParser.json());

// Specify routes
// Get balance of address
app.get('/v1/:address/balance', (req, res) => {
    console.log(req.params);
    res.sendStatus(501);
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
app.listen(config.Port, (err) => {
  if (err) {
    return console.error(`Error starting server: ${err}`);
  }
  return console.log(`server is listening on ${config.Port}`);
});
