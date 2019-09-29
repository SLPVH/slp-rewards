import SLPSDK = require('slp-sdk');

export class SLPHelper {
    private SLP: any;

    constructor(restURL: string) {
        this.SLP = new SLPSDK({
            restURL: restURL
        });
    }

    public DollarToTokenConversion(dollarAmount: number, tokensPerDollar: number): number {
        return Math.round(dollarAmount * tokensPerDollar);
    }

    public async GetSLPTokenSymbol(tokenId: string): Promise<string> {
        try {
            const details = await this.SLP.Utils.list(tokenId);
            if (!details || details.id === 'not found') {
                return Promise.reject(`The Token Id '${tokenId}' does not exist on this chain`);
            }

            return details.symbol as string;
        } catch (ex) {
            return Promise.reject(ex.message || ex.error || ex);
        }
    }

    public async GetTokenBalanceOfSLPAddress(tokenId: string, address: string): Promise<number> {
        try {
            const details = await this.SLP.Utils.balance(address, tokenId);
            return details.balance as number;
        } catch (ex) {
            return Promise.reject(ex.message || ex.error || ex);
        }
    }

    public async GetBalanceOfBCHAddress(address: string): Promise<number> {
        try {
            const details = await this.SLP.Address.details(address);
            return (details.balance as number) + (details.unconfirmedBalance as number);
        } catch (ex) {
            return Promise.reject(ex.message || ex.error || ex);
        }
    }

    public async GetLastSLPTX(tokenId: string, address: string): Promise<string> {
        try {
            const fundingAddressBCH = this.SLP.Address.toCashAddress(address);
            const details = await this.SLP.Address.transactions(address);

            let txid = '';

            // Check latest TXs for a receive of this specific SLP token
            for (const detail of details.txs) {
                let decoded: any;
                try {
                    decoded = await this.SLP.Utils.decodeOpReturn(detail.txid);
                } catch (ex) {
                    continue;
                }
                if (decoded.tokenId === tokenId && decoded.spendData && decoded.spendData.length) {
                    for (const spendData of decoded.spendData) {
                        if (spendData.sentTo === fundingAddressBCH) {
                            txid = detail.txid;
                            break;
                        }
                    }
                }
                if (txid !== '') {
                    break;
                }
            }

            return Promise.resolve(txid);
        } catch (ex) {
            return Promise.reject(ex.message || ex.error || ex);
        }
    }

    public async CreateSLPToken(
        fundingAddress: string,
        fundingWif: string,
        decimals: number,
        name: string,
        symbol: string,
        documentUri: string,
        documentHash: string,
        amount: number): Promise<string> {
            try {
                const tokenId = await this.SLP.TokenType1.create({
                    fundingAddress: fundingAddress,
                    fundingWif: fundingWif,
                    tokenReceiverAddress: fundingAddress,
                    bchChangeReceiverAddress: this.SLP.Address.toCashAddress(fundingAddress),
                    batonReceiverAddress: fundingAddress,
                    decimals: decimals,
                    name: name,
                    symbol: symbol,
                    documentUri: documentUri,
                    documentHash: documentHash,
                    initialTokenQty: amount
                });

                return tokenId;
            } catch (ex) {
                return Promise.reject(ex.message || ex.error || ex);
            }
    }

    public async MintSLPTokens(
        fundingAddress: string,
        fundingWif: string,
        tokenId: string,
        amount: number): Promise<string> {
            try {
                const txId = await this.SLP.TokenType1.mint({
                    fundingAddress: fundingAddress,
                    fundingWif: fundingWif,
                    tokenReceiverAddress: fundingAddress,
                    bchChangeReceiverAddress: this.SLP.Address.toCashAddress(fundingAddress),
                    batonReceiverAddress: fundingAddress,
                    tokenId: tokenId,
                    additionalTokenQty: amount
                });

                return txId;
            } catch (ex) {
                return Promise.reject(ex.message || ex.error || ex);
            }
    }

    public async SendSLPTokensToAddress(
        fundingAddress: string,
        fundingWif: string,
        toAddress: string,
        tokenId: string,
        amount: number): Promise<string> {
        try {
            const txId = await this.SLP.TokenType1.send({
                fundingAddress: fundingAddress,
                fundingWif: fundingWif,
                tokenReceiverAddress: toAddress,
                bchChangeReceiverAddress: this.SLP.Address.toCashAddress(fundingAddress),
                tokenId: tokenId,
                amount: amount
            });

            return txId;
        } catch (ex) {
            return Promise.reject(ex.message || ex.error || ex);
        }
    }
}
