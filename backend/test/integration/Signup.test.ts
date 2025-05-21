import axios from "axios";
import sinon from "sinon";
import { AccountRepositoryDatabase, AccountRepositoryMemory } from "../../src/infra/repository/AccountRepository";
import DatabaseConnection, { PgPromiseAdapter } from "../../src/infra/database/DatabaseConnection";
import GetAccount from "../../src/application/usecase/GetAccount";
import Signup from "../../src/application/usecase/Signup";
import Account from "../../src/domain/Account";

axios.defaults.validateStatus = () => true;

let signup: Signup;
let getAccount: GetAccount;
let connection: DatabaseConnection;

beforeEach(() => {
    connection = new PgPromiseAdapter();
    const accountRepository = new AccountRepositoryDatabase(connection);
    // const accountRepository = new AccountRepositoryMemory();
    signup = new Signup(accountRepository);
    getAccount = new GetAccount(accountRepository);
});

test("Deve criar uma conta válida", async () => {
    const inputSignup = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    const outputSignup = await signup.execute(inputSignup);
    expect(outputSignup.accountId).toBeDefined();
    const outputGetAccount = await getAccount.execute(outputSignup.accountId)
    expect(outputGetAccount.name).toBe(inputSignup.name);
    expect(outputGetAccount.email).toBe(inputSignup.email);
    expect(outputGetAccount.document).toBe(inputSignup.document);
});

test("Não deve criar uma conta com nome inválido", async () => {
    const inputSignup = {
        name: "John",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    await expect(() => signup.execute(inputSignup)).rejects.toThrow("Invalid name");
});

test("Deve criar uma conta válida com stub", async () => {
    const saveAccountStub = sinon.stub(AccountRepositoryDatabase.prototype, "saveAccount").resolves();
    const inputSignup = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    const getAccountByIdStub = sinon.stub(AccountRepositoryDatabase.prototype, "getAccountById").resolves(Account.create(inputSignup.name, inputSignup.email, inputSignup.document, inputSignup.password));
    const outputSignup = await signup.execute(inputSignup);
    expect(outputSignup.accountId).toBeDefined();
    const outputGetAccount = await getAccount.execute(outputSignup.accountId)
    expect(outputGetAccount.name).toBe(inputSignup.name);
    expect(outputGetAccount.email).toBe(inputSignup.email);
    expect(outputGetAccount.document).toBe(inputSignup.document);
    saveAccountStub.restore();
    getAccountByIdStub.restore();
});

test("Deve criar uma conta válida com spy", async () => {
    const saveAccountSpy = sinon.spy(AccountRepositoryDatabase.prototype, "saveAccount");
    const inputSignup = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    const outputSignup = await signup.execute(inputSignup);
    expect(outputSignup.accountId).toBeDefined();
    const outputGetAccount = await getAccount.execute(outputSignup.accountId)
    expect(outputGetAccount.name).toBe(inputSignup.name);
    expect(outputGetAccount.email).toBe(inputSignup.email);
    expect(outputGetAccount.document).toBe(inputSignup.document);
    expect(saveAccountSpy.calledOnce).toBe(true);
    const account = new Account(outputSignup.accountId, inputSignup.name, inputSignup.email, inputSignup.document, inputSignup.password, []);
    expect(saveAccountSpy.calledWith(account)).toBe(true);
    saveAccountSpy.restore();
});

test("Deve criar uma conta válida com mock", async () => {
    const accountRepositoryMock = sinon.mock(AccountRepositoryDatabase.prototype);
    accountRepositoryMock.expects("saveAccount").once().resolves();
    const inputSignup = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    accountRepositoryMock.expects("getAccountById").once().resolves(new Account("", inputSignup.name, inputSignup.email, inputSignup.document, inputSignup.password, []));
    const outputSignup = await signup.execute(inputSignup);
    expect(outputSignup.accountId).toBeDefined();
    const outputGetAccount = await getAccount.execute(outputSignup.accountId)
    expect(outputGetAccount.name).toBe(inputSignup.name);
    expect(outputGetAccount.email).toBe(inputSignup.email);
    expect(outputGetAccount.document).toBe(inputSignup.document);
    accountRepositoryMock.verify();
    accountRepositoryMock.restore();
});

test("Deve criar uma conta válida com fake", async () => {
    const accountRepository = new AccountRepositoryMemory();
    signup = new Signup(accountRepository);
    getAccount = new GetAccount(accountRepository);
    const inputSignup = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    const outputSignup = await signup.execute(inputSignup);
    expect(outputSignup.accountId).toBeDefined();
    const outputGetAccount = await getAccount.execute(outputSignup.accountId)
    expect(outputGetAccount.name).toBe(inputSignup.name);
    expect(outputGetAccount.email).toBe(inputSignup.email);
    expect(outputGetAccount.document).toBe(inputSignup.document);
});

afterEach(async () => {
    await connection.close();
});
