import { isUndefined, noop } from "lodash";
import * as restify from "restify";
import { Module } from "../src";
import { DumbResource } from "./resources/dumbResource";
import { DumbService } from "./services/dumb.service";

@Module({
    debug: true,
    restify: "server",
    resources: [DumbResource],
    providers: [DumbService]
})
export class Server {
    public readonly server: restify.Server;

    constructor(restifyServer?: restify.Server, serverOptions?: restify.ServerOptions) {
        this.server = <restify.Server>restifyServer;

        if (isUndefined(restifyServer)) {
            this.server = restify.createServer(serverOptions || { name: "kresst-integration-server" });
        }
    }

    public start(port: number = 8080, listeningListener: Function = () => console.log(`Listening on ${this.server.url}`)): void {
        this.server.listen(port, listeningListener);
    }

    public stop(callback: Function = noop): void {
        this.server.close(callback);
    }
}
