import { HandlerDecorator, Method, RouteOptions } from "../../../index";
import { RequestHandler } from "restify";

export const PATCH = (options: RouteOptions = "/", ...middleware: Array<RequestHandler>): HandlerDecorator => {
    return Method("patch", options, ...middleware);
};
