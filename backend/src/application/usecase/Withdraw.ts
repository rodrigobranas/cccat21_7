import AccountRepository from "../../infra/repository/AccountRepository";

export default class Withdraw {

    constructor (readonly accountRepository: AccountRepository) {
    }

    async execute (input: Input) {
        const account = await this.accountRepository.getAccountById(input.accountId);
        account.withdraw(input.assetId, input.quantity);
        await this.accountRepository.updateAccount(account);
    }
}

type Input = {
    accountId: string,
    assetId: string,
    quantity: number
}
