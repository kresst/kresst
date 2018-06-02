import { HandlerDecorator, Method, RouteOptions } from "../../../index";
import { RequestHandler } from "restify";

export const OPTIONS = (options: RouteOptions = "/", ...middleware: Array<RequestHandler>): HandlerDecorator => {
    return Method("opts", options, ...middleware);
};
