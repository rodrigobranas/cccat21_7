import amqp from "amqplib";

async function main () {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    await channel.assertExchange("orderPlaced", "direct", { durable: true });
    await channel.assertExchange("orderFilled", "direct", { durable: true });
    await channel.assertExchange("tradeCreated", "direct", { durable: true });

    await channel.assertQueue("orderPlaced.executeOrder", { durable: true });
    await channel.assertQueue("orderPlaced.updateDepth", { durable: true });
    await channel.assertQueue("orderFilled.updateOrder", { durable: true });
    await channel.assertQueue("orderFilled.updateDepth", { durable: true });
    await channel.assertQueue("tradeCreated.saveTrade", { durable: true });

    await channel.bindQueue("orderPlaced.executeOrder", "orderPlaced", "");
    await channel.bindQueue("orderPlaced.updateDepth", "orderPlaced", "");
    await channel.bindQueue("orderFilled.updateOrder", "orderFilled", "");
    await channel.bindQueue("orderFilled.updateDepth", "orderFilled", "");
    await channel.bindQueue("tradeCreated.saveTrade", "tradeCreated", "");
    
}

main();
