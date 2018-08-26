import { List } from "immutable";
import { RequestHandler } from "restify";
import { RouteOptions } from "./router/RouteOptions";

export interface ResourceMethodMetadata {
    key: string | symbol;
    target: Object;
    method: string;
    options: RouteOptions;
    middleware: List<RequestHandler>;
}

export type ResourceMethodMetadataList = List<ResourceMethodMetadata>;
export type ResourceMethodMetadataArray = Array<ResourceMethodMetadata>;
