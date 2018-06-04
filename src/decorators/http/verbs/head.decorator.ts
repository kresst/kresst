import { RequestHandler } from "restify";
import { HTTPMethodDecorator, Method, RouteOptions } from "../../../index";

export const HEAD: HTTPMethodDecorator = (options: RouteOptions = "/", ...middleware: Array<RequestHandler>): MethodDecorator => {
    return Method("head", options, ...middleware);
};
