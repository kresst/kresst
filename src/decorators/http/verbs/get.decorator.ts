import { RequestHandler } from "restify";
import { HTTPMethodDecorator, Method, RouteOptions } from "../../../index";

export const GET: HTTPMethodDecorator = (options: RouteOptions = "/", ...middleware: Array<RequestHandler>): MethodDecorator => {
    return Method("get", options, ...middleware);
};
