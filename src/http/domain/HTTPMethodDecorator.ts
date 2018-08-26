import { RouteOptions } from "@kresst/core";
import { RequestHandler } from "restify";

export type HTTPMethodDecorator = (options?: RouteOptions, ...middleware: Array<RequestHandler>) => MethodDecorator;
