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
            const details = await this.SLP.Address.details(`${address}`);
            return (details.balance as number) + (details.unconfirmedBalance as number);
        } catch (ex) {
            return Promise.reject(ex.message || ex.error || ex);
        }
    }

    public async GetLastTX(address: string): Promise<string> {
        try {
            const details = await this.SLP.Address.transactions(`${address}`);
            return details.txs.length > 0 ? details.txs[0].txid : '';
        } catch (ex) {
            return Promise.reject(ex.message || ex.error || ex);
        }
    }

    public async SendSLPTokensToAddress(
        fundingAddress: string,
        fundingWif: string,
        toAddress: string,
        tokenId: string,
        amount: number): Promise<string>  {
        try {
            const data = {
                fundingAddress: fundingAddress,
                fundingWif: fundingWif,
                tokenReceiverAddress: toAddress,
                bchChangeReceiverAddress: this.SLP.Address.toCashAddress(fundingAddress),
                tokenId: tokenId,
                amount: amount
            };

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
