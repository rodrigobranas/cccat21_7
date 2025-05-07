import Account from "../../domain/Account";
import AccountAsset from "../../domain/AccountAsset";
import DatabaseConnection from "../database/DatabaseConnection";

export default interface AccountRepository {
    saveAccount (account: Account): Promise<void>;
    getAccountById (accountId: string): Promise<Account>;
    getAccountAssets (accountId: string): Promise<AccountAsset[]>;
    getAccountAsset (accountId: string, assetId: string): Promise<AccountAsset>;
    updateAccountAsset (accountAsset: AccountAsset): Promise<void>;
    saveAccountAsset (accountAsset: AccountAsset): Promise<void>;
}

export class AccountRepositoryDatabase implements AccountRepository {

    constructor (readonly connection: DatabaseConnection) {
    }

    async saveAccount(account: Account): Promise<void> {
        await this.connection.query("insert into ccca.account (account_id, name, email, document, password) values ($1, $2, $3, $4, $5)", [account.accountId, account.name, account.email, account.document, account.password]);
        
    }

    async getAccountById(accountId: string): Promise<Account> {
        const [accountData] = await this.connection.query("select * from ccca.account where account_id = $1", [accountId]);
        return new Account(accountData.account_id, accountData.name, accountData.email, accountData.document, accountData.password);
    }

    async getAccountAssets(accountId: string): Promise<AccountAsset[]> {
        const accountAssetsData = await this.connection.query("select * from ccca.account_asset where account_id = $1", [accountId]);
        const accountAssets: AccountAsset[] = [];
        for (const accountAssetData of accountAssetsData) {
            accountAssets.push(new AccountAsset(accountAssetData.account_id, accountAssetData.asset_id, parseFloat(accountAssetData.quantity)));
        }
        return accountAssets;
    }

    async getAccountAsset (accountId: string, assetId: string): Promise<AccountAsset> {
        const [accountAssetData] = await this.connection.query("select * from ccca.account_asset where account_id = $1 and asset_id = $2", [accountId, assetId]);
        if (!accountAssetData) throw new Error("Asset not found");
        return new AccountAsset(accountAssetData.account_id, accountAssetData.asset_id, parseFloat(accountAssetData.quantity))
    }

    async updateAccountAsset (accountAsset: AccountAsset) {
        await this.connection.query("update ccca.account_asset set quantity = $1 where account_id = $2 and asset_id = $3", [accountAsset.getQuantity(), accountAsset.accountId, accountAsset.assetId]);
    }

    async saveAccountAsset (accountAsset: AccountAsset) {
        await this.connection.query("insert into ccca.account_asset (account_id, asset_id, quantity) values ($1, $2, $3)", [accountAsset.accountId, accountAsset.assetId, accountAsset.getQuantity()]);
    }

}

export class AccountRepositoryMemory implements AccountRepository {
    
    accounts: any = [];

    async saveAccount(account: any): Promise<void> {
        this.accounts.push(account);
    }

    async getAccountById(accountId: string): Promise<any> {
        const account = this.accounts.find((account: any) => account.accountId === accountId);
        return account;
    }

    async getAccountAssets(accountId: string): Promise<any> {
        return [];
    }

    getAccountAsset(accountId: string, assetId: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
    
    updateAccountAsset(accountAsset: AccountAsset): Promise<void> {
        throw new Error("Method not implemented.");
    }

    saveAccountAsset(accountAsset: AccountAsset): Promise<void> {
        throw new Error("Method not implemented.");
    }

}
