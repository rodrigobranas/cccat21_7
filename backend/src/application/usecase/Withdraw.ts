import AccountRepository from "../../infra/repository/AccountRepository";

export default class Withdraw {

    constructor (readonly accountRepository: AccountRepository) {
    }

    async execute (input: Input) {
        const accountAsset = await this.accountRepository.getAccountAsset(input.accountId, input.assetId);
        accountAsset.withdraw(input.quantity);
        await this.accountRepository.updateAccountAsset(accountAsset);
    }
}

type Input = {
    accountId: string,
    assetId: string,
    quantity: number
}
