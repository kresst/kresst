import { List } from "immutable";
import { RequestHandler } from "restify";
import { METADATA_KEYS, Newable, ResourceMetadata } from "../../domain";
import { sanitizePath } from "../../utils";
import { makeInjectable } from "../di";

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
