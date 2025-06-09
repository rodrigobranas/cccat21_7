import Book from "../../domain/Book";
import Order from "../../domain/Order";
import Trade from "../../domain/Trade";
import BookCache from "../cache/BookCache";
import WebSocketServer from "../websocket/WebSocketServer";
import Queue from "./Queue";

function sleep (time: number) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
}

export default class BookQueue {

    static config (queue: Queue, websocketServer: WebSocketServer, bookCache: BookCache) {
        queue.consume("orderPlaced.executeOrder", async (input: any) => {
            console.log("orderPlaced", new Date());
            const order = new Order(input.orderId, input.marketId, input.accountId, input.side, input.quantity, input.price, input.status, new Date(input.timestamp), input.fillQuantity, input.fillPrice);
            let book: Book;
            if (bookCache.has(order.marketId)) {
                book = bookCache.get(order.marketId);
            } else {
                book = new Book(order.marketId);
                book.register("orderFilled", async (order: Order) => {
                    // await orderRepository.updateOrder(order);
                    await sleep(100);
                    await queue.publish("orderFilled", order);
                });
                book.register("tradeCreated", async (trade: Trade) => {
                    // await tradeRepository.saveTrade(trade);
                    await sleep(100);
                    await queue.publish("tradeCreated", trade);
                });
                bookCache.add(book.marketId, book);
            }
            await book.insert(order);
            const depth = book.getDepth();
            await websocketServer.broadcast(depth);
        });
    }

}
