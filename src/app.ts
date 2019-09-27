// Import Node modules
import * as bodyParser from 'body-parser';
import express from 'express';
import { HelloWorldRequest } from './models/http_requests/helloWorldRequest';

// Setup basic HTTP server on port 3000
const app = express();
const port = 3000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Specify routes
// Hello world Post request test
app.post('/helloWorldPost', (req, res) => {
    let request: HelloWorldRequest;

    try {
        request = new HelloWorldRequest(req.body);
        res.json({response: request.echo});
    } catch (ex) {
        if (ex instanceof TypeError) {
            res.status(400).json({err: 'Bad Parameters'});
        }
    }
});

// Root GET request for a 'Hello World' test
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Starts server with routes/port specified
app.listen(port, (err) => {
  if (err) {
    return console.error(`Error starting server: ${err}`);
  }
  return console.log(`server is listening on ${port}`);
});
