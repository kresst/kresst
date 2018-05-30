import { Method } from "../../";
import { RouteOptions } from "../../domain/decorators/ResourceMethodMetadata";
import { RequestHandler } from "restify";
import { HandlerDecorator } from "../../domain/decorators/HandlerDecorator";

export const PUT = (options: RouteOptions = "/", ...middleware: Array<RequestHandler>): HandlerDecorator => {
    return Method("put", options, ...middleware);
};
