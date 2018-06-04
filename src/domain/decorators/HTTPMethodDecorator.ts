import { RequestHandler } from "restify";
import { RouteOptions } from "../router";

export type HTTPMethodDecorator = (options?: RouteOptions, ...middleware: Array<RequestHandler>) => MethodDecorator;
