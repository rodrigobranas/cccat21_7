import express, { Express, Request, Response } from "express";
import cors from "cors";
import Hapi, { Request as HapiRequest, ResponseToolkit } from "@hapi/hapi";

export default interface HttpServer {
    route (method: string, url: string, callback: Function): void;
    listen (port: number): void;
}

export class ExpressAdapter implements HttpServer {
    app: Express;

    constructor () {
        this.app = express();
        this.app.use(express.json());
        this.app.use(cors());
    }

    route(method: "get" | "post" | "put" | "delete", url: string, callback: Function): void {
        this.app[method](url.replace(/\{|\}/g, ""), async (req: Request, res: Response) => {
            try {
                const output = await callback(req.params, req.body);
                res.json(output);
            } catch (e: any) {
                console.log(e.message);
                res.status(422).json({
                    error: e.message
                });
            }
        });
    }

    listen(port: number): void {
        this.app.listen(port);
    }

}

export class HapiAdapter implements HttpServer {
    server: Hapi.Server;

    constructor () {
        this.server = Hapi.server({});
    }

    route(method: "get" | "post" | "put" | "delete", url: string, callback: Function): void {
        this.server.route({
            method,
            path: url.replace(/\:/g, ""),
            async handler (request: HapiRequest, reply: ResponseToolkit) {
                try {
                    const output = await callback(request.params, request.payload);
                    return output;
                } catch (e: any) {
                    return reply.response({ error: e.message }).code(422);
                }
            }
        });
    }

    listen(port: number): void {
        this.server.settings.port = port;
        this.server.start();
    }

}