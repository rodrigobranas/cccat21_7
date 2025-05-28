import WebSocket, { Server } from "ws";

export default interface WebSocketServer {
    broadcast (message: any): Promise<void>;
}

export class WSSAdapter implements WebSocketServer {
    wss: Server;
    connections: any[];

    constructor (port: number) {
        this.wss = new WebSocket.Server({ port });
        this.connections = [];
        this.wss.on("connection", (ws) => {
            console.log("new client");
            this.connections.push(ws);
        });
    }

    async broadcast(message: any): Promise<void> {
        for (const connection of this.connections) {
            await connection.send(Buffer.from(JSON.stringify(message)));
        }
    }

}
