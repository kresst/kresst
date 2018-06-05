import { isRegExp, isString } from "lodash";
import { KresstRequestHandler } from "../../../../domain/index";
import { dedupeSlashes } from "../../../../utils/index";
import { getRouteHandler } from "./getRouteHandler";
import { getServerMethod } from "./getServerMethod";
import { IRouteData } from "../../../../domain/decorators/IRouteData";

export const registerRoute = ({ server, instance, metadata, middleware, methodMetadata }: IRouteData): string => {
    const serverMethod: Function = getServerMethod(server, methodMetadata);
    const handler: KresstRequestHandler = getRouteHandler(instance, methodMetadata.key);

    const routeOptions: any = isString(methodMetadata.options) ? { path: methodMetadata.options } : methodMetadata.options;

    if (isString(metadata.path) && metadata.path.length > 0) {
        if (isString(routeOptions.path)) {
            routeOptions.path = dedupeSlashes(`/${metadata.path}/${routeOptions.path}`);
        } else if (isRegExp(routeOptions.path)) {
            const path = dedupeSlashes(`${metadata.path}/${routeOptions.path.source}`);
            routeOptions.path = new RegExp(path);
        }
    }

    serverMethod.call(server, routeOptions, [...middleware.toArray(), ...methodMetadata.middleware.toArray()], handler);

    return routeOptions.path;
};
