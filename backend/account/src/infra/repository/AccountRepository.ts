import Account from "../../domain/Account";
import AccountAsset from "../../domain/AccountAsset";
import Asset from "../../domain/Asset";
import DatabaseConnection from "../database/DatabaseConnection";

export default interface AccountRepository {
    saveAccount (account: Account): Promise<void>;
    updateAccount (account: Account): Promise<void>;
    getAccountById (accountId: string): Promise<Account>;
}

export class AccountRepositoryDatabase implements AccountRepository {

    constructor (readonly connection: DatabaseConnection) {
    }

    async saveAccount(account: Account): Promise<void> {
        await this.connection.query("insert into ccca.account (account_id, name, email, document, password) values ($1, $2, $3, $4, $5)", [account.accountId, account.name, account.email, account.document, account.password]);
        
    }

    async updateAccount(account: Account): Promise<void> {
        // update ccca.account set name, email, document, password...
        await this.connection.query("delete from ccca.account_asset where account_id = $1", [account.accountId]);
        for (const asset of account.getAssets()) {
            await this.connection.query("insert into ccca.account_asset (account_id, asset_id, quantity) values ($1, $2, $3)", [asset.accountId, asset.assetId, asset.quantity]);
        }
    }

    async getAccountById(accountId: string): Promise<Account> {
        const [accountData] = await this.connection.query("select * from ccca.account where account_id = $1", [accountId]);
        const accountAssetsData = await this.connection.query("select * from ccca.account_asset where account_id = $1", [accountId]);
        const assets: Asset[] = [];
        for (const accountAssetData of accountAssetsData) {
            assets.push(new Asset(accountAssetData.account_id, accountAssetData.asset_id, parseFloat(accountAssetData.quantity)));
        }
        return new Account(accountData.account_id, accountData.name, accountData.email, accountData.document, accountData.password, assets);
    }

}

export class AccountRepositoryMemory implements AccountRepository {
    
    accounts: any = [];

    async saveAccount(account: any): Promise<void> {
        this.accounts.push(account);
    }

    async updateAccount(account: Account): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async getAccountById(accountId: string): Promise<any> {
        const account = this.accounts.find((account: any) => account.accountId === accountId);
        return account;
    }

}
