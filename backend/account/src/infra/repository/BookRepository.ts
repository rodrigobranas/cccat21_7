import Book from "../../domain/Book";
import Order from "../../domain/Order";
import DatabaseConnection from "../database/DatabaseConnection";
import { Mediator } from "../mediator/Mediator";

export default interface BookRepository {
    getBooks (): Promise<Book[]>;
}

export class BookRepositoryDatabase implements BookRepository {

    constructor (readonly connection: DatabaseConnection) {
    }

    async getBooks(): Promise<Book[]> {
        const ordersData = await this.connection.query("select * from ccca.order where status = $1", ["open"]);
        const index: { [marketId: string]: Order[] } = {};
        for (const orderData of ordersData) {
            const order = new Order(orderData.order_id, orderData.market_id, orderData.account_id, orderData.side, parseFloat(orderData.quantity), parseFloat(orderData.price), orderData.status, orderData.timestamp, parseFloat(orderData.fill_quantity), parseFloat(orderData.fill_price));
            index[order.marketId] = index[order.marketId] || [];
            index[order.marketId].push(order);
        }
        const books: Book[] = [];
        for (const marketId in index) {
            const book = new Book(marketId);
            const orders = index[marketId];
            for (const order of orders) {
                book.insert(order, false);
            }
            books.push(book);
        }
        return books;
    }

}
