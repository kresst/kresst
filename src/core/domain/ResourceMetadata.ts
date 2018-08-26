import { KresstRequestHandler } from "@kresst/http";
import { List } from "immutable";

export interface ResourceMetadata<T> {
    path?: string;
    middleware: List<KresstRequestHandler>;
    constructor: T;
}

export type ResourceMetadataList<T> = List<ResourceMetadata<T>>;
export type ResourceMetadataArray<T> = Array<ResourceMetadata<T>>;
