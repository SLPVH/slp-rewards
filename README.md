# E-Commerce website that uses SLP Tokens as a customer loyalty rewards program!

For our hackathon we built an e-commerce demo website that demonstrates how a merchant could use SLP tokens as a customer loyalty rewards program.

Our demo allows visitors to purchase merchandise from the website and be rewarded with the merchants loyalty token during checkout. A returning customer can come back to the demo website to spend the token.

## Video Demonstration

Check out our video to see it in action!

[![Watch the video](https://img.youtube.com/vi/I3m6oswRNBo/hqdefault.jpg)](https://www.youtube.com/watch?v=I3m6oswRNBo)

## Set Up & Installation:

NPM version used: 6.11.3
Node version used: 8.11.1

Windows: Will need python 2.7 installed for bitbox-sdk

Need to install globally: npm, node, typescript, tslint, nodemon, bitbox-sdk

Don't forget to run "npm install"!

Make sure to look at the "config.json" section below to make configuration changes before running.

Then "npm start" should build and run the server
Use "npm run startdev" to rebuild and run server everytime there is a file change (*.ts files only)

If the server is running, access the demo at "http://localhost:3000/shopping.html"

## Configuration

You can configure the e-commerce website demo to use any SLP token! You will have to provide a Token ID, funding address, and a funding wif.

### config.json (Server Config):
slp-rewards/config.json

* Port: The port at which to run the SLP Rewards server. Default should be fine, change as needed

* RestURL: THe url of the server running a BCH REST node. Default should be fine, change as needed

* TokenID: The ID of the token you want to use on the Reward Server. If you have a token created, put the token ID here. Otherwise, run the "Create SLP Token" endpoint under "Endpoints" later in the readme.

* FundingAddress: The address, in SLP format, used to fund the token for the server (For minting endpoint, assumption is that this address has the minting baton for the token). This address should have some BCH on it. This must be filled in before running the server.

* FundingWif: The compressed WIF Private Key of the above address. This must be filled in before running the server.

* TokensPerDollar: How many tokens someone gets per dollar in the demo. Ie if this is set to 5, and someone spends $2, they get 10 tokens. 

```javascript
{
    "Port": 3000,
    "RestURL": "https://rest.bitcoin.com/v2/",
    "TokenId": "bc1f1f7288f0a91cfe6f2e6bde3a581b772657512974193dbf55a10f844e0057",
    "FundingAddress": "simpleledger:qr20x7r7efz668dvcp3ejhqrkka62saykyqpzc3e48",
    "FundingWif": "foobar",
    "tokensPerDollar": 5
}
```

### Endpoints:

See "Examples/SLP Rewards API.postman_collection.json" for examples on these endpoints (Postman required)

Note that the port 3000 shown here is the default. If you changed in the config.json, you'll have to replace it with your port.

Return is always JSON object with 2 properties, response and err. response will be an object and err will be null when the response code is 2xx. All other codes, response will be null and err will be a string with error details.

GET Hello World:

Executing a GET request against "localhost:3000" should return some JSON to show the server is running.

POST Hellow World:

Executing a POST request against "localhost:3000/postTest" with a JSON body object, single string property of "data" with some data. Will return some JSON echoing that data.

GET Address BCH Balance:

Executing a GET request against "localhost:3000/v1/address/{address}/balance", where {address} is an address in BCH format, returns the BCH blanace (unconfirmed included) of the speicifc address ("balance" property on response object).

GET Address SLP Balance:

Executing a GET request against "localhost:3000/v1/address/{address}/token/balance", where {address} is an address in BCH format, returns the configured SLP token blanace (unconfirmed included) of the speicifc address ("balance" property on response object), along with the configured symbol ("symbol" property on response object).

POST Send SLP tokens to Address:

Executing a POST request against "localhost:3000/v1/address/{address}/token/send", where {address} is an address in SLP format, and the JSON body with number property "dollarAmount" filled in, will convert the dollarAmount to token amount (based on configured "tokensPerDollar"), and send that converted amount of the configured SLP tokens from the funding address to the address specified. Will return the "txId" on the response object.

GET Check If Funding Address Received TX:

Executing a GET request against "localhost:3000/v1/funding/tx/check" will send a request lasting up to 30 seconds to see if a new SLP incoming transaction has been received since the last time this endpoint was hit (or on server start). If after 30 seconds nothing is found, a 408 is returned. If one is found, a 200 response will respond with the "txId" on the response object of the TX that was detected.

GET Dollar to Token Conversion:

Executing a GET request against "localhost:3000/v1/dollarAmount/{dollarAmount}/tokens", where {dollarAmount} is a dollar mount, will return how many of the configured tokens would be sent if this amount was spent, based on the "tokensPerDollar" configured. Returns "amount" on the response object.

POST Mint SLP Tokens:

Executing a POST request against "localhost:3000/v1/funding/token/mint", and the JSON body with number property "amount" filled in, will mint that amount of the configured SLP token to the funding address. The funding address must have the mint baton for this to work, or an error will be returned. Returns the "txId" on the response object.

POST Create SLP Token:

Executing a POST request against "localhost:3000/v1/funding/token/create", and the JSON body with number "tokensPerDollar" for the conversion rate, "amount" for the initial mint, and the other properties ("decimals", "name", "symbol", "documentUri", "documentHash", which you can find more about on an SLP site explaining token configuration) will create that new token on the funding address, passing it the mint baton as well. Returns the "tokenId" of the new token created. NOTE: This updates the "TokenId" and "TokensPerDollar" in the config.json, so the server will use this as it's newly configured token in the current and future runs

### config.js (Frontend Config):
slp-rewards/static/web/js/config.js

* productList: An object array of products that will be shown on the shopping page that the customer can add to their cart
for purchase.

* Token_Price_Multiplier: This should be equal to the tokensPerDollar variable in config.json

* fundingAddress: This should be equal to the fundingAddress in config.json

* tokenId: This should be equal to TokenID in config.json

* tokenName: This is the name of the token you want to be displayed on the e-commerce website

```javascript
let productList = [
    {
    id: 1,
    title: "Coated Black Bear",
    desc: "A stylish pair of sun glasses with reflective shielding",
    price: 39.99,
    image: "./img/sun-glasses.jpeg"
    },
    ...
]

let Token_Price_Multiplier = 5
let fundingAddress = "simpleledger:qr20x7r7efz668dvcp3ejhqrkka62saykyqpzc3e48"
let tokenId = "8cf6dbfde03d63f300b0ffe77842859d0048f8101aab3001e3ff030898673fb2"
let tokenName = "SLP Reward Points"
```

### Screenshots

Shopping page with all the products available that the customer can add to their shopping cart.

![Shopping Page](/screenshots/shopping.png)

Shopping cart page where the customer can enter in their SLP Address to receive the merchants loyalty token.

![Shopping Cart](/screenshots/cart.png)

Checkout page where the customer can review their final order.

![Checkout Page](/screenshots/checkout.png)

Order complete page. Informs the customer that the loyalty token has been sent to their wallet. The customer is navigated to this page if they selected credit card as their method of payment during checkout.

![Order Complete](/screenshots/order-complete.png)

QR loyalty token payment page. This is where the customer would be navigated to when they select the loyalty token for payment during checkout. The customer would use their SLP supported wallet to scan the QR code and send the loyalty token to the merchant for payment.

![QR Token Payment](/screenshots/qr-payment.png)
