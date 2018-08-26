import { RouteOptions } from "@kresst/core";
import { HTTPMethodDecorator, Method } from "@kresst/http";
import { RequestHandler } from "restify";

export const POST: HTTPMethodDecorator = (options: RouteOptions = "/", ...middleware: Array<RequestHandler>): MethodDecorator => {
    return Method("post", options, ...middleware);
};
