import { RouteOptions } from "@kresst/core";
import { HTTPMethodDecorator, Method } from "@kresst/http";
import { RequestHandler } from "restify";

export const PATCH: HTTPMethodDecorator = (options: RouteOptions = "/", ...middleware: Array<RequestHandler>): MethodDecorator => {
    return Method("patch", options, ...middleware);
};
