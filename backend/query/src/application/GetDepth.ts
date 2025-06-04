import DatabaseConnection from "../infra/database/DatabaseConnection";

export default class GetDepth {

    constructor (readonly connection: DatabaseConnection) {
    }

    async execute (marketId: string): Promise<Output> {
        const data = await this.connection.query("select * from ccca.depth where market_id = $1", [marketId]);
        const output: Output = {
            buys: data
                .filter((depth: Depth) => depth.side === "buy")
                .map((depth: Depth) => ({ price: depth.price, quantity: depth.quantity })),
            sells: data
                .filter((depth: Depth) => depth.side === "sell")
                .map((depth: Depth) => ({ price: depth.price, quantity: depth.quantity }))
        }
        return output;
    }
}

type Depth = {
    side: string,
    quantity: number,
    price: number
}

type Output = {
    buys: { quantity: number, price: number }[],
    sells: { quantity: number, price: number }[]
}
