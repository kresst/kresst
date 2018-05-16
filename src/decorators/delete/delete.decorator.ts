import { Method } from "../../";
import { RouteOptions } from "../../domain/ControllerMethodMetadata";
import { RequestHandler } from "restify";
import { HandlerDecorator } from "../../domain/HandlerDecorator";

export const DELETE = (options: RouteOptions = "/", ...middleware: Array<RequestHandler>): HandlerDecorator => {
    return Method("del", options, ...middleware);
};
