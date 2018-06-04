import { RequestHandler } from "restify";
import { HTTPMethodDecorator, Method, RouteOptions } from "../../../index";

export const PUT: HTTPMethodDecorator = (options: RouteOptions = "/", ...middleware: Array<RequestHandler>): MethodDecorator => {
    return Method("put", options, ...middleware);
};
