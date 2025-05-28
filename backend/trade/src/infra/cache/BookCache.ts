import Book from "../../domain/Book";

export default class BookCache {
    private cache: { [marketId: string]: Book} = {};

    load (books: Book[]) {
        for (const book of books) {
            this.cache[book.marketId] = book;
        }
    }

    add (marketId: string, book: Book) {
        this.cache[marketId] = book;
    }

    get (marketId: string) {
        const book = this.cache[marketId];
        if (!book) throw new Error("Book not found");
        return book;
    }

    has (marketId: string) {
        return !!this.cache[marketId];
    }
}