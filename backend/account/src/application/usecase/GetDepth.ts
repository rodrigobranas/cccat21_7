import { groupOrders } from "../../domain/groupOrders";
import OrderRepository from "../../infra/repository/OrderRepository";

export default class GetDepth {

    constructor (readonly orderRepository: OrderRepository) {
    }

    async execute (marketId: string, precision: number): Promise<Output> {
        const orders = await this.orderRepository.getOrdersByMarketIdAndStatus(marketId, "open");
        const index = groupOrders(orders, precision);
        const output: Output = {
            buys: [],
            sells: []
        }
        for (const price in index.buy) {
            output.buys.push({ quantity: index.buy[price], price: parseFloat(price) });
        }
        for (const price in index.sell) {
            output.sells.push({ quantity: index.sell[price], price: parseFloat(price) });
        }
        return output;
    }
}

type Output = {
    buys: { quantity: number, price: number }[],
    sells: { quantity: number, price: number }[]
}
