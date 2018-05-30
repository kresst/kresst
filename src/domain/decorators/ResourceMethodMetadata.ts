import { RequestHandler } from "restify";

export type StrOrRegex = string | RegExp;
export type RouteOptions = StrOrRegex | { path: StrOrRegex } | { options: Object; path: StrOrRegex } & Object;

export interface ResourceMethodMetadata {
    options: RouteOptions;
    middleware: Array<RequestHandler>;
    target: any;
    method: string;
    key: string;
}

export type ResourceMethodMetadataList = Array<ResourceMethodMetadata>;
