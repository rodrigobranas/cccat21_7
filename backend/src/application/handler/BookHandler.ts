import WebSocketServer from "../../infra/websocket/WebSocketServer";
import Book from "../../domain/Book";
import Order from "../../domain/Order";
import Trade from "../../domain/Trade";
import { Mediator } from "../../infra/mediator/Mediator";
import OrderRepository from "../../infra/repository/OrderRepository";
import TradeRepository from "../../infra/repository/TradeRepository";

export default class BookHandler {

    static config (mediator: Mediator, websocketServer: WebSocketServer, book: Book, orderRepository: OrderRepository, tradeRepository: TradeRepository) {
        mediator.register("orderPlaced", async (order: Order) => {
            await book.insert(order);
            const depth = book.getDepth();
            await websocketServer.broadcast(depth);
        })
        mediator.register("orderFilled", async (order: Order) => {
            orderRepository.updateOrder(order);
        });
        mediator.register("tradeCreated", async (trade: Trade) => {
            tradeRepository.saveTrade(trade);
        });
    }
}