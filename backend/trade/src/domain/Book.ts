import { Mediator } from "../infra/mediator/Mediator";
import { Observable } from "../infra/mediator/Observable";
import { groupOrders } from "./groupOrders";
import Order from "./Order";
import Trade from "./Trade";

export default class Book extends Observable {
    buys: Order[];
    sells: Order[];

    constructor (readonly marketId: string) {
        super();
        this.buys = [];
        this.sells = [];
    }

    async insert (order: Order, execute: boolean = true) {
        if (order.side === "buy") {
            this.buys.push(order);
            this.buys.sort((a: Order, b: Order) => b.price - a.price);
        } else {
            this.sells.push(order);
            this.sells.sort((a: Order, b: Order) => a.price - b.price);
        }
        if (execute) await this.execute();
    }

    async execute () {
        while (true) {
            const highestBuy = this.buys[0];
            const lowestSell = this.sells[0];
            if (!highestBuy) break;
            if (!lowestSell) break;
            if (highestBuy.price < lowestSell.price) break;
            const fillQuantity = Math.min(highestBuy.getAvailableQuantity(), lowestSell.getAvailableQuantity());
            const fillPrice = (highestBuy.timestamp.getTime() > lowestSell.timestamp.getTime()) ? lowestSell.price : highestBuy.price;
            const tradeSide = (highestBuy.timestamp.getTime() > lowestSell.timestamp.getTime()) ? "buy" : "sell";
            highestBuy.fill(fillQuantity, fillPrice);
            lowestSell.fill(fillQuantity, fillPrice);
            if (highestBuy.status === "closed") this.buys.splice(this.buys.indexOf(highestBuy), 1);
            if (lowestSell.status === "closed") this.sells.splice(this.sells.indexOf(lowestSell), 1);
            await this.notifyAll("orderFilled", highestBuy);
            await this.notifyAll("orderFilled", lowestSell);
            const trade = Trade.create(highestBuy.marketId, highestBuy.orderId, lowestSell.orderId, tradeSide, fillQuantity, fillPrice);
            await this.notifyAll("tradeCreated", trade);
        }
    }

    getDepth () {
        const orders = [...this.buys, ...this.sells];
        const index = groupOrders(orders, 1);
        const depth: any = {
            marketId: this.marketId,
            buys: [],
            sells: []
        }
        for (const price in index.buy) {
            depth.buys.push({ quantity: index.buy[price], price: parseFloat(price) });
        }
        for (const price in index.sell) {
            depth.sells.push({ quantity: index.sell[price], price: parseFloat(price) });
        }
        return depth;
    }
}