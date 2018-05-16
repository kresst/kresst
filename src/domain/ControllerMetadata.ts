import { RequestHandler } from "restify";

export interface ControllerMetadata<T> {
    path?: string;
    middleware: Array<RequestHandler>;
    constructor: T;
}

export type ControllerMetadataList = Array<ControllerMetadata<any>>;
