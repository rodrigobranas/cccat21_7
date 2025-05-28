import GetDepth from "../../src/application/usecase/GetDepth";
import PlaceOrder from "../../src/application/usecase/PlaceOrder";
import Signup from "../../src/application/usecase/Signup";
import DatabaseConnection, { PgPromiseAdapter } from "../../src/infra/database/DatabaseConnection";
import { Mediator } from "../../src/infra/mediator/Mediator";
import { AccountRepositoryDatabase } from "../../src/infra/repository/AccountRepository";
import { OrderRepositoryDatabase } from "../../src/infra/repository/OrderRepository";

let connection: DatabaseConnection;
let signup: Signup;
let placeOrder: PlaceOrder;
let getDepth: GetDepth;
let marketId: string;

beforeEach(async () => {
    connection = new PgPromiseAdapter();
    const orderRepository = new OrderRepositoryDatabase(connection);
    const accountRepository = new AccountRepositoryDatabase(connection);
    signup = new Signup(accountRepository);
    placeOrder = new PlaceOrder(orderRepository, new Mediator(), undefined);
    getDepth = new GetDepth(orderRepository);
    marketId = `BTC/USD${Math.random()}`;
});

test("Deve retornar o depth após a realização de ordens de compra e venda sem precision", async () => {
    const inputSignup = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    const outputSignup = await signup.execute(inputSignup);
    const inputPlaceOrder1 = {
        marketId,
        accountId: outputSignup.accountId,
        side: "sell",
        quantity: 1,
        price: 94000
    }
    await placeOrder.execute(inputPlaceOrder1);
    const inputPlaceOrder2 = {
        marketId,
        accountId: outputSignup.accountId,
        side: "sell",
        quantity: 1,
        price: 94500
    }
    await placeOrder.execute(inputPlaceOrder2);
    const inputPlaceOrder3 = {
        marketId,
        accountId: outputSignup.accountId,
        side: "sell",
        quantity: 1,
        price: 94600
    }
    await placeOrder.execute(inputPlaceOrder3);
    const outputGetDepth = await getDepth.execute(marketId, 0);
    expect(outputGetDepth.sells).toHaveLength(3);
    expect(outputGetDepth.sells[0].quantity).toBe(1);
    expect(outputGetDepth.sells[0].price).toBe(94000);
    expect(outputGetDepth.sells[1].quantity).toBe(1);
    expect(outputGetDepth.sells[1].price).toBe(94500);
    expect(outputGetDepth.sells[2].quantity).toBe(1);
    expect(outputGetDepth.sells[2].price).toBe(94600);
    expect(outputGetDepth.buys).toHaveLength(0);
});

test("Deve retornar o depth após a realização de ordens de compra e venda sem precision mas com valores iguais", async () => {
    const inputSignup = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    const outputSignup = await signup.execute(inputSignup);
    const inputPlaceOrder1 = {
        marketId,
        accountId: outputSignup.accountId,
        side: "sell",
        quantity: 1,
        price: 94000
    }
    await placeOrder.execute(inputPlaceOrder1);
    const inputPlaceOrder2 = {
        marketId,
        accountId: outputSignup.accountId,
        side: "sell",
        quantity: 1,
        price: 94000
    }
    await placeOrder.execute(inputPlaceOrder2);
    const inputPlaceOrder3 = {
        marketId,
        accountId: outputSignup.accountId,
        side: "sell",
        quantity: 1,
        price: 94000
    }
    await placeOrder.execute(inputPlaceOrder3);
    const outputGetDepth = await getDepth.execute(marketId, 0);
    expect(outputGetDepth.sells).toHaveLength(1);
    expect(outputGetDepth.sells[0].quantity).toBe(3);
    expect(outputGetDepth.sells[0].price).toBe(94000);
    expect(outputGetDepth.buys).toHaveLength(0);
});

test("Deve retornar o depth após a realização de ordens de compra e venda com precision de 3 casas", async () => {
    const inputSignup = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    const outputSignup = await signup.execute(inputSignup);
    const inputPlaceOrder1 = {
        marketId,
        accountId: outputSignup.accountId,
        side: "sell",
        quantity: 1,
        price: 94000
    }
    await placeOrder.execute(inputPlaceOrder1);
    const inputPlaceOrder2 = {
        marketId,
        accountId: outputSignup.accountId,
        side: "sell",
        quantity: 1,
        price: 94500
    }
    await placeOrder.execute(inputPlaceOrder2);
    const inputPlaceOrder3 = {
        marketId,
        accountId: outputSignup.accountId,
        side: "sell",
        quantity: 1,
        price: 94600
    }
    await placeOrder.execute(inputPlaceOrder3);
    const outputGetDepth = await getDepth.execute(marketId, 3);
    expect(outputGetDepth.sells).toHaveLength(1);
    expect(outputGetDepth.sells[0].quantity).toBe(3);
    expect(outputGetDepth.sells[0].price).toBe(94000);
    expect(outputGetDepth.buys).toHaveLength(0);
});

afterEach(async () => {
    await connection.close();
})