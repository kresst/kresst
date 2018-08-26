import { RequestHandler } from "restify";
import { RouteOptions } from "@kresst/core";
import { HTTPMethodDecorator, Method } from "@kresst/http";

export const HEAD: HTTPMethodDecorator = (options: RouteOptions = "/", ...middleware: Array<RequestHandler>): MethodDecorator => {
    return Method("head", options, ...middleware);
};
