import { RequestHandler } from "restify";
import { HTTPMethodDecorator, Method, RouteOptions } from "../../../index";

export const PATCH: HTTPMethodDecorator = (options: RouteOptions = "/", ...middleware: Array<RequestHandler>): MethodDecorator => {
    return Method("patch", options, ...middleware);
};
