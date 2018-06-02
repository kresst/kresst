import { HandlerDecorator, Method, RouteOptions } from "../../../index";
import { RequestHandler } from "restify";

export const POST = (options: RouteOptions = "/", ...middleware: Array<RequestHandler>): HandlerDecorator => {
    return Method("post", options, ...middleware);
};
