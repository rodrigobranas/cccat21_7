import { Mediator } from "../../infra/mediator/Mediator";
import WebSocketServer from "../../infra/websocket/WebSocketServer";
import ExecuteOrder from "../usecase/ExecuteOrder";
import GetDepth from "../usecase/GetDepth";

export default class OrderHandler {

    static config (mediator: Mediator, websocketServer: WebSocketServer, executeOrder: ExecuteOrder, getDepth: GetDepth) {
        mediator.register("orderPlaced", async (data: any) => {
            await executeOrder.execute({ marketId: data.marketId });
            const depth = await getDepth.execute(data.marketId, 0);
            websocketServer.broadcast(depth);
        });
    }
}