Useful Info:

NPM version used: 6.11.3
Node version used: 8.11.1

Windows: Will need python 2.7 installed for bitbox-sdk

Need to install globally: npm, node, typescript, tslint, nodemon

Don't forget to run "npm install". 

Modify the "config.json" to fit your needs

Then "npm start" should build and run the server
Use "npm run startdev" to rebuild and run server everytime there is a file change


config.json breakdown:
Port: The port at which to run the SLP Rewards server
RestURL: THe url of the server running a BCH REST node.
TokenID: The ID of the token you want to use on the Reward Server
FundingAddress: The BCH address used to fund the token for the server
FundingWif: The BCH Private Key used to fund the token for the server