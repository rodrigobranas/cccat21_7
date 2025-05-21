import Order from "../../domain/Order";
import { Mediator } from "../../infra/mediator/Mediator";
import OrderRepository from "../../infra/repository/OrderRepository";
import GetDepth from "./GetDepth";

export default class PlaceOrder {

    constructor (readonly orderRepository: OrderRepository, readonly mediator: Mediator = new Mediator()) {
    }

    async execute (input: Input): Promise<Output> {
        const order = Order.create(input.marketId, input.accountId, input.side, input.quantity, input.price);
        await this.orderRepository.saveOrder(order);
        await this.mediator.notifyAll("orderPlaced", order);
        return {
            orderId: order.orderId
        }
    }
}

type Input = {
    marketId: string,
    accountId: string,
    side: string,
    quantity: number,
    price: number
}

type Output = {
    orderId: string
}
