import { HandlerDecorator, Method, RouteOptions } from "../../../index";
import { RequestHandler } from "restify";

export const PUT = (options: RouteOptions = "/", ...middleware: Array<RequestHandler>): HandlerDecorator => {
    return Method("put", options, ...middleware);
};
