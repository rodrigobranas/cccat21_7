import AccountAsset from "../../domain/AccountAsset";
import AccountRepository from "../../infra/repository/AccountRepository";

export default class Deposit {

    constructor (readonly accountRepository: AccountRepository) {
    }

    async execute (input: Input): Promise<void> {
        const account = await this.accountRepository.getAccountById(input.accountId);
        account.deposit(input.assetId, input.quantity);
        await this.accountRepository.updateAccount(account);
    }
}

type Input = {
    accountId: string,
    assetId: string,
    quantity: number
}
