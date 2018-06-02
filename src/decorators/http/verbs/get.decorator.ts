import { RequestHandler } from "restify";
import { HandlerDecorator, Method, RouteOptions } from "../../../index";

export const GET = (options: RouteOptions = "/", ...middleware: Array<RequestHandler>): HandlerDecorator => {
    return Method("get", options, ...middleware);
};
