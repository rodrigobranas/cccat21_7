import WebSocketServer from "../../infra/websocket/WebSocketServer";
import Book from "../../domain/Book";
import Order from "../../domain/Order";
import Trade from "../../domain/Trade";
import { Mediator } from "../../infra/mediator/Mediator";
import OrderRepository from "../../infra/repository/OrderRepository";
import TradeRepository from "../../infra/repository/TradeRepository";
import BookCache from "../../infra/cache/BookCache";

export default class BookHandler {

    static config (mediator: Mediator, websocketServer: WebSocketServer, bookCache: BookCache, orderRepository: OrderRepository, tradeRepository: TradeRepository) {
        mediator.register("orderPlaced", async (order: Order) => {
            let book: Book;
            if (bookCache.has(order.marketId)) {
                book = bookCache.get(order.marketId);
            } else {
                book = new Book(order.marketId);
                book.register("orderFilled", async (order: Order) => {
                    await orderRepository.updateOrder(order);
                });
                book.register("tradeCreated", async (trade: Trade) => {
                    await tradeRepository.saveTrade(trade);
                });
                bookCache.add(book.marketId, book);
            }
            await book.insert(order);
            const depth = book.getDepth();
            await websocketServer.broadcast(depth);
        });
    }
}