let SLPSDK = require('slp-sdk');

export class SLPHelper {
    private SLP: any;

    constructor(restURL: string) {
        this.SLP = new SLPSDK({ 
            restURL: restURL 
        });
    }

    async GetSLPTokenSymbol(tokenId: string) : Promise<string> {
        try {
            const details = await this.SLP.Utils.list(tokenId);
            if (!details || details.id === 'not found') {
                return Promise.reject(`The Token Id '${tokenId}' does not exist on this chain`);
            }
            
            return details.symbol as string;
        } catch(ex) {
            return Promise.reject(ex.message);
        }
    } 

    async GetTokenBalanceOfSLPAddress(tokenId: string, address: string) : Promise<number> {
        try {
            const details = await this.SLP.Utils.balance(address, tokenId);
            return details.balance as number;
        } catch(ex) {
            return Promise.reject(ex.message);
        }
    } 

    async GetBalanceOfBCHAddress(address: string) : Promise<number> {
        try {
            let details = await this.SLP.Address.details(`${address}`);
            return details.balance as number;
        } catch(ex) {
            return Promise.reject(ex.message);
        }
    } 
}