import { isFunction, merge } from "lodash";
import * as restify from "restify";
import { Server, ServerOptions } from "restify";
import { Module } from "..";

export const testServerFactory = (
    controller: any,
    serverOptions?: ServerOptions,
    moduleConfig?: any,
    serverConfigFn?: (server: Server) => void
): Server => {
    const defaultConfig = {
        restify: "server",
        controllers: [controller]
    };

    const _moduleConfig = merge({}, defaultConfig, moduleConfig || {});

    @Module(_moduleConfig)
    class Test {
        public readonly server: Server = restify.createServer(serverOptions);
    }

    const testServer = new Test().server;

    if (isFunction(serverConfigFn)) {
        serverConfigFn.apply(undefined, [testServer]);
    }

    return testServer;
};
