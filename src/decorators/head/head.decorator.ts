import { Method } from "../../";
import { RouteOptions } from "../../domain/decorators/ControllerMethodMetadata";
import { RequestHandler } from "restify";
import { HandlerDecorator } from "../../domain/decorators/HandlerDecorator";

export const HEAD = (options: RouteOptions = "/", ...middleware: Array<RequestHandler>): HandlerDecorator => {
    return Method("head", options, ...middleware);
};
