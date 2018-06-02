import { HandlerDecorator, Method, RouteOptions } from "../../../index";
import { RequestHandler } from "restify";

export const HEAD = (options: RouteOptions = "/", ...middleware: Array<RequestHandler>): HandlerDecorator => {
    return Method("head", options, ...middleware);
};
