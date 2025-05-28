import AccountRepository from "../../infra/repository/AccountRepository";

export default class GetAccount {

    constructor (readonly accountRepository: AccountRepository) {
    }

    async execute (accountId: string): Promise<Output> {
        const account = await this.accountRepository.getAccountById(accountId);
        const output: Output = {
            accountId: account.accountId,
            name: account.name,
            email: account.email,
            document: account.document,
            password: account.password,
            assets: []
        }
        for (const asset of account.getAssets()) {
            output.assets.push({ assetId: asset.assetId, quantity: asset.quantity });
        }
        return output;
    }
}

type Output = {
    accountId: string,
    name: string,
    email: string,
    document: string,
    password: string,
    assets: { assetId: string, quantity: number }[]
}
