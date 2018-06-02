import { RequestHandler } from "restify";
import { HandlerDecorator, Method, RouteOptions } from "../../../index";

export const DELETE = (options: RouteOptions = "/", ...middleware: Array<RequestHandler>): HandlerDecorator => {
    return Method("del", options, ...middleware);
};
