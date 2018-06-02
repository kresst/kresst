import { List } from "immutable";
import { RequestHandler } from "restify";
import { RouteOptions } from "../router/RouteOptions";

export interface ResourceMethodMetadata {
    key: string;
    target: any;
    method: string;
    options: RouteOptions;
    middleware: List<RequestHandler>;
}

export type ResourceMethodMetadataList = List<ResourceMethodMetadata>;
export type ResourceMethodMetadataArray = Array<ResourceMethodMetadata>;
