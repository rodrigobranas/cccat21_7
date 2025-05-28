import amqp from "amqplib";

async function main () {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    channel.consume("test.a", (message: any) => {
        const input = JSON.parse(message.content.toString());
        console.log(input);
        channel.ack(message);
    });
}

main();
