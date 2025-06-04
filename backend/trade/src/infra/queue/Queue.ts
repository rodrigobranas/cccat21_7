import amqp from "amqplib";

export default interface Queue {
    connect (): Promise<void>;
    publish (event: string, input: any): Promise<void>;
    consume (event: string, callback: Function): Promise<void>;
}

export class RabbitMQAdapter implements Queue {
    private connection!: amqp.ChannelModel;
    private channel!: amqp.Channel;

    async connect(): Promise<void> {
        this.connection = await amqp.connect("amqp://localhost");
        this.channel = await this.connection.createChannel();
    }

    async publish(event: string, input: any): Promise<void> {
        this.channel.publish(event, "", Buffer.from(JSON.stringify(input)));
    }

    async consume(event: string, callback: Function): Promise<void> {
        this.channel.consume(event, async (message: any) => {
            const input = JSON.parse(message.content.toString());
            await callback(input);
            this.channel.ack(message);
        });
    }

}
