import Trade from "../../domain/Trade";
import DatabaseConnection from "../database/DatabaseConnection";

export default interface TradeRepository {
    saveTrade (trade: Trade): Promise<void>;
    getTradesByMarketId (marketId: string): Promise<Trade[]>;
}

export class TradeRepositoryDatabase implements TradeRepository {

    constructor (readonly connection: DatabaseConnection) {
    }

    async saveTrade(trade: Trade): Promise<void> {
        await this.connection.query("insert into ccca.trade (trade_id, market_id, buy_order_id, sell_order_id, side, quantity, price, timestamp) values ($1, $2, $3, $4, $5, $6, $7, $8)", [trade.tradeId, trade.marketId, trade.buyOrderId, trade.sellOrderId, trade.side, trade.quantity, trade.price, trade.timestamp]);
    }

    async getTradesByMarketId(marketId: string): Promise<Trade[]> {
        const tradesData = await this.connection.query("select * from ccca.trade where market_id = $1", marketId);
        const trades: Trade[] = [];
        for (const tradeData of tradesData) {
            trades.push(new Trade(tradeData.trade_id, tradeData.market_id, tradeData.buy_order_id, tradeData.sell_order_id, tradeData.side, parseFloat(tradeData.quantity), parseFloat(tradeData.price), tradeData.timestamp));
        }
        return trades;
    }

}
