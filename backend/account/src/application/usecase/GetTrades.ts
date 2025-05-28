import OrderRepository from "../../infra/repository/OrderRepository";
import TradeRepository from "../../infra/repository/TradeRepository";

export default class GetTrades {

    constructor (readonly tradeRepository: TradeRepository) {
    }

    async execute (marketId: string) {
        const trades = this.tradeRepository.getTradesByMarketId(marketId);
        return trades;
    }
}
