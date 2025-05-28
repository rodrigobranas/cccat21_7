import Book from "../../src/domain/Book";
import Order from "../../src/domain/Order";
import Trade from "../../src/domain/Trade";
import { Mediator } from "../../src/infra/mediator/Mediator";

function sleep (time: number) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
}

test("Deve criar ordens de compra e venda", async () => {
    const book = new Book("BTC/USD");
    const orders: Order[] = [];
    const trades: Trade[] = [];
    book.register("orderFilled", async (order: Order) => {
        orders.push(order);
    });
    book.register("tradeCreated", async (trade: Trade) => {
        trades.push(trade);
    });
    await book.insert(Order.create("BTC/USD", "", "buy", 1, 94000));
    await sleep(10);
    expect(book.getDepth().buys).toHaveLength(1);
    expect(book.getDepth().sells).toHaveLength(0);
    await book.insert(Order.create("BTC/USD", "", "sell", 1, 95000));
    await sleep(10);
    expect(book.getDepth().buys).toHaveLength(1);
    expect(book.getDepth().sells).toHaveLength(1);
    await book.insert(Order.create("BTC/USD", "", "sell", 1, 93000));
    await sleep(10);
    expect(book.getDepth().buys).toHaveLength(0);
    expect(book.getDepth().sells).toHaveLength(1);
    await book.insert(Order.create("BTC/USD", "", "buy", 1, 95400));
    await sleep(10);
    expect(book.getDepth().buys).toHaveLength(0);
    expect(book.getDepth().sells).toHaveLength(0);
    expect(orders.at(0)?.side).toBe("buy");
    expect(orders.at(0)?.fillQuantity).toBe(1);
    expect(orders.at(0)?.fillPrice).toBe(94000);
    expect(orders.at(1)?.side).toBe("sell");
    expect(orders.at(1)?.fillQuantity).toBe(1);
    expect(orders.at(1)?.fillPrice).toBe(94000);
    expect(orders.at(2)?.side).toBe("buy");
    expect(orders.at(2)?.fillQuantity).toBe(1);
    expect(orders.at(2)?.fillPrice).toBe(95000);
    expect(orders.at(3)?.side).toBe("sell");
    expect(orders.at(3)?.fillQuantity).toBe(1);
    expect(orders.at(3)?.fillPrice).toBe(95000);
    expect(trades.at(0)?.side).toBe("sell");
    expect(trades.at(0)?.price).toBe(94000);
    expect(trades.at(1)?.side).toBe("buy");
    expect(trades.at(1)?.price).toBe(95000);
});