import { RequestHandler } from "restify";
import { HTTPMethodDecorator, Method, RouteOptions } from "../../../index";

export const DELETE: HTTPMethodDecorator = (options: RouteOptions = "/", ...middleware: Array<RequestHandler>): MethodDecorator => {
    return Method("del", options, ...middleware);
};
