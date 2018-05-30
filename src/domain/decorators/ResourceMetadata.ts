import { RequestHandler } from "restify";

export interface ResourceMetadata<T> {
    path?: string;
    middleware: Array<RequestHandler>;
    constructor: T;
}

export type ResourceMetadataList = Array<ResourceMetadata<any>>;
