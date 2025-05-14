import Order from "./Order";

export function groupOrders (orders: Order[], precision: number) {
    const index: any = {
        buy: {},
        sell: {}
    }
    for (const order of orders) {
        let price = order.price;
        if (precision > 0) {
            price -= price % 10 ** precision;
            // price = price.slice(0, precision * -1) + "0".repeat(precision);
        }
        index[order.side][price] = index[order.side][price] || 0;
        index[order.side][price] += order.getAvailableQuantity();
    }
    return index;
}