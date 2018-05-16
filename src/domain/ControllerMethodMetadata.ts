import { RequestHandler } from "restify";

export type StrOrRegex = string | RegExp;
export type RouteOptions = StrOrRegex | { path: StrOrRegex } | { options: Object; path: StrOrRegex } & Object;

export interface ControllerMethodMetadata {
    options: RouteOptions;
    middleware: Array<RequestHandler>;
    target: any;
    method: string;
    key: string;
}

export type ControllerMethodMetadataList = Array<ControllerMethodMetadata>;
