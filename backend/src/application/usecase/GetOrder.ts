import OrderRepository from "../../infra/repository/OrderRepository";

export default class GetOrder {

    constructor (readonly orderRepository: OrderRepository) {
    }

    async execute (orderId: string) {
        const orderData = await this.orderRepository.getOrderById(orderId);
        const order = {
            orderId: orderData.orderId,
            marketId: orderData.marketId,
            accountId: orderData.accountId,
            side: orderData.side,
            quantity: orderData.quantity,
            price: orderData.price,
            status: orderData.status,
            timestamp: orderData.timestamp,
            fillQuantity: orderData.fillQuantity,
            fillPrice: orderData.fillPrice
        }
        return order;
    }
}