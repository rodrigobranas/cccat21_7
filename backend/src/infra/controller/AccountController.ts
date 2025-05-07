import Deposit from "../../application/usecase/Deposit";
import HttpServer from "../http/HttpServer";
import Withdraw from "../../application/usecase/Withdraw";
import GetAccount from "../../application/usecase/GetAccount";
import Signup from "../../application/usecase/Signup";

export default class AccountController {

    static config (
        httpServer: HttpServer,
        signup: Signup,
        deposit: Deposit,
        withdraw: Withdraw,
        getAccount: GetAccount
    ) {
        httpServer.route("post", "/signup", async (params: any, body: any) => {
            const input = body;
            const output = await signup.execute(input);
            return output;
        });
        
        httpServer.route("post", "/deposit", async (params: any, body: any) => {
            const input = body;
            await deposit.execute(input);
        });
        
        httpServer.route("post", "/withdraw", async (params: any, body: any) => {
                const input = body;
                await withdraw.execute(input);
        });
        
        httpServer.route("get", "/accounts/:accountId", async (params: any, body: any) => {
            const accountId = params.accountId;
            const output = await getAccount.execute(accountId);
            return output;
        });
    }
}