import { METADATA_KEYS } from "@kresst/constants";
import { Newable, ResourceMetadata } from "@kresst/core";
import { makeInjectable } from "@kresst/di";
import { sanitizePath } from "@kresst/utils";
import { List } from "immutable";
import { RequestHandler } from "restify";

export const Resource = (path?: string, ...middleware: Array<RequestHandler>) => {
    return <T extends Newable>(constructor: T) => {
        const key = METADATA_KEYS.RESOURCE;
        const sanitizedPath = sanitizePath(path, constructor.name);
        const metadata: ResourceMetadata<T> = {
            path: sanitizedPath,
            middleware: List(middleware),
            constructor
        };
        Reflect.defineMetadata(key, metadata, constructor);

        return makeInjectable(constructor);
    };
};
