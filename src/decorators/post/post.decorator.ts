import { Method } from "../../";
import { RouteOptions } from "../../domain/ControllerMethodMetadata";
import { RequestHandler } from "restify";
import { HandlerDecorator } from "../../domain/HandlerDecorator";

export const POST = (options: RouteOptions = "/", ...middleware: Array<RequestHandler>): HandlerDecorator => {
    return Method("post", options, ...middleware);
};
