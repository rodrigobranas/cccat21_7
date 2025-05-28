import amqp from "amqplib";

async function main () {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    await channel.assertExchange("test", "direct", { durable: true });
    await channel.assertQueue("test.a", { durable: true });
    await channel.assertQueue("test.b", { durable: true });
    await channel.bindQueue("test.a", "test", "");
    await channel.bindQueue("test.b", "test", "");
    const input = {
        a: 1
    }
    channel.publish("test", "", Buffer.from(JSON.stringify(input)));
}

main();
