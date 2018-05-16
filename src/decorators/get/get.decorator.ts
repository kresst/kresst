import { RequestHandler } from "restify";
import { Method } from "../../";
import { RouteOptions } from "../../domain/ControllerMethodMetadata";
import { HandlerDecorator } from "../../domain/HandlerDecorator";

export const GET = (options: RouteOptions = "/", ...middleware: Array<RequestHandler>): HandlerDecorator => {
    return Method("get", options, ...middleware);
};
