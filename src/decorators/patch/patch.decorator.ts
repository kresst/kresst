import { Method } from "../../";
import { RouteOptions } from "../../domain/ControllerMethodMetadata";
import { RequestHandler } from "restify";
import { HandlerDecorator } from "../../domain/HandlerDecorator";

export const PATCH = (options: RouteOptions = "/", ...middleware: Array<RequestHandler>): HandlerDecorator => {
    return Method("patch", options, ...middleware);
};
