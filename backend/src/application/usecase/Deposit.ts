import AccountAsset from "../../domain/AccountAsset";
import AccountDAO from "../../infra/repository/AccountRepository";

export default class Deposit {

    constructor (readonly accountDAO: AccountDAO) {
    }

    async execute (input: Input): Promise<void> {
        const accountAsset = new AccountAsset(input.accountId, input.assetId, input.quantity);
        await this.accountDAO.saveAccountAsset(accountAsset);
    }
}

type Input = {
    accountId: string,
    assetId: string,
    quantity: number
}
