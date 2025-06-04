import UpdateDepth from "../../application/UpdateDepth";
import WebSocketServer from "../websocket/WebSocketServer";
import Queue from "./Queue";

export default class BookQueue {

    static config (queue: Queue, websocketServer: WebSocketServer, updateDepth: UpdateDepth) {
        queue.consume("orderPlaced.updateDepth", async (input: any) => {
            input.event = "orderPlaced";
            await updateDepth.execute(input);
            // atualizar depth
            // const depth = {};
            // await websocketServer.broadcast(depth);
        });
        queue.consume("orderFilled.updateDepth", async (input: any) => {
            input.event = "orderFilled";
            await updateDepth.execute(input);
        });
    }

}
