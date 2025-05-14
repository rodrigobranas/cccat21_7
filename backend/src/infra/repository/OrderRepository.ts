import Order from "../../domain/Order";
import DatabaseConnection from "../database/DatabaseConnection";

export default interface OrderRepository {
    saveOrder (order: Order): Promise<void>;
    updateOrder (order: Order): Promise<void>;
    getOrderById (orderId: string): Promise<Order>;
    getOrdersByMarketIdAndStatus (marketId: string, status: string): Promise<Order[]>;
    deleteAll (): Promise<void>;
}

export class OrderRepositoryDatabase implements OrderRepository {

    constructor (readonly connection: DatabaseConnection) {
    }

    async saveOrder (order: Order) {
        await this.connection.query("insert into ccca.order (order_id, market_id, account_id, side, quantity, price, status, timestamp, fill_quantity, fill_price) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)", [order.orderId, order.marketId, order.accountId, order.side, order.quantity, order.price, order.status, order.timestamp, order.fillQuantity, order.fillPrice]);
    }
    
    async getOrderById (orderId: string): Promise<Order> {
        const [orderData] = await this.connection.query("select * from ccca.order where order_id = $1", [orderId]);
        return new Order(orderData.order_id, orderData.market_id, orderData.account_id, orderData.side, parseFloat(orderData.quantity), parseFloat(orderData.price), orderData.status, orderData.timestamp, parseFloat(orderData.fill_quantity), parseFloat(orderData.fill_price));
    }

    async getOrdersByMarketIdAndStatus (marketId: string, status: string): Promise<Order[]> {
        const ordersData = await this.connection.query("select * from ccca.order where market_id = $1 and status = $2", [marketId, status]);
        const orders: Order[] = [];
        for (const orderData of ordersData) {
            orders.push(new Order(orderData.order_id, orderData.market_id, orderData.account_id, orderData.side, parseFloat(orderData.quantity), parseFloat(orderData.price), orderData.status, orderData.timestamp, parseFloat(orderData.fill_quantity), parseFloat(orderData.fill_price)));
        }
        return orders;
    }

    async deleteAll(): Promise<void> {
        await this.connection.query("delete from ccca.order", []);
    }

    async updateOrder(order: Order): Promise<void> {
        await this.connection.query("update ccca.order set fill_quantity = $1, fill_price = $2, status = $3 where order_id = $4", [order.fillQuantity, order.fillPrice, order.status, order.orderId]);
    }
    
}
