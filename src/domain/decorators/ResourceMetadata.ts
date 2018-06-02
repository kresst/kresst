import { List } from "immutable";
import { RequestHandler } from "restify";

export interface ResourceMetadata<T> {
    path?: string;
    middleware: List<RequestHandler>;
    constructor: T;
}

export type ResourceMetadataList<T> = List<ResourceMetadata<T>>;
export type ResourceMetadataArray<T> = Array<ResourceMetadata<T>>;
