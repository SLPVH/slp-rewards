# E-Commerce website that uses SLP Tokens as a customer loyalty rewards program!

For our hackathon we built an e-commerce demo website that demonstrates how a merchant could use SLP tokens as a customer loyalty rewards program.

Our demo allows visitors to purchase merchandise from the website and be rewarded with the merchants token during checkout. A returning customer can come back to the demo website to spend the token.

## Set Up & Installation:

NPM version used: 6.11.3
Node version used: 8.11.1

Windows: Will need python 2.7 installed for bitbox-sdk

Need to install globally: npm, node, typescript, tslint, nodemon

Don't forget to run "npm install". 

Then "npm start" should build and run the server
Use "npm run startdev" to rebuild and run server everytime there is a file change

## Configuration

You can configure the e-commerce website demo to use any SLP token! You will have to provide a Token ID, funding address, and a funding wif.

### config.json:

Port: The port at which to run the SLP Rewards server

RestURL: THe url of the server running a BCH REST node.

TokenID: The ID of the token you want to use on the Reward Server

FundingAddress: The BCH address used to fund the token for the server

FundingWif: The BCH Private Key used to fund the token for the server

tokensPerDollar: How many tokens someone gets per dollar. Ie if this is set to 5, and someone spends $2, they get 10 tokens

### config.js:

productList: An object array of products that will be shown on the shopping page that the customer can add to their car for purchase.

Token_Price_Multiplier: This should be equal to the tokensPerDollar variable in config.json

fundingAddress: This should be equal to the fundingAddress in config.json

tokenId: This should be equal to TokenID in config.json

tokenName: This is the name of the token you want to be displayed on the e-commerce website

### Screenshots

TO DO: 
