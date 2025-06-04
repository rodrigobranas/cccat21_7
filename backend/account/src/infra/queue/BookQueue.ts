import Book from "../../domain/Book";
import Order from "../../domain/Order";
import Trade from "../../domain/Trade";
import BookCache from "../cache/BookCache";
import OrderRepository from "../repository/OrderRepository";
import TradeRepository from "../repository/TradeRepository";
import WebSocketServer from "../websocket/WebSocketServer";
import Queue from "./Queue";

export default class BookQueue {

    static config (queue: Queue, orderRepository: OrderRepository, tradeRepository: TradeRepository) {
        queue.consume("orderFilled.updateOrder", async (input: any) => {
            console.log("orderFilled", new Date());
            const order = new Order(input.orderId, input.marketId, input.accountId, input.side, input.quantity, input.price, input.status, new Date(input.timestamp), input.fillQuantity, input.fillPrice);
            await orderRepository.updateOrder(order);
        });
        queue.consume("tradeCreated.saveTrade", async (input: any) => {
            console.log("tradeCreated", new Date());
            const trade = new Trade(input.tradeId, input.marketId, input.buyOrderId, input.sellOrderId, input.side, input.quantity, input.price, new Date(input.timestamp));
            await tradeRepository.saveTrade(trade);
        });
    }

}
