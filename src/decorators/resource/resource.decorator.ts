import { camelCase, isString } from "lodash";
import { RequestHandler } from "restify";
import { METADATA_KEYS } from "../../domain/Constants";
import { ResourceMetadata } from "../../domain/decorators/ResourceMetadata";
import { Newable } from "../../domain/Newable";
import { makeInjectable } from "../injectable/injectable.decorator";

const dedupeSlashes = (value: string) => {
    return value.replace(/(\/)\/+/g, "$1").replace(/\/$/, "");
};

const sanitizePath = (path: string = "", defaultPath: string): string => {
    let _path;

    if (isString(path)) {
        _path = path.trim();
    } else if (isString(defaultPath)) {
        _path = camelCase(defaultPath);
    }

    return dedupeSlashes(`/${_path}`);
};

export const Resource = (path?: string, ...middleware: Array<RequestHandler>) => {
    return <T extends Newable>(constructor: T) => {
        path = sanitizePath(path, constructor.name);
        const key = METADATA_KEYS.RESOURCE;
        const metadata: ResourceMetadata<T> = {
            path,
            middleware,
            constructor
        };
        Reflect.defineMetadata(key, metadata, constructor);

        return makeInjectable(constructor);
    };
};
