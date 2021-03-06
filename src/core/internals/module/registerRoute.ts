import { KresstRequestHandler } from "@kresst/http";
import { isRegExp, isString } from "lodash";
import { IRouteData } from "../../domain/IRouteData";
import { dedupeSlashes } from "../../../utils/index";
import { getRouteHandler } from "./getRouteHandler";
import { getServerMethod } from "./getServerMethod";

export const registerRoute = ({ server, instance, metadata, methodMetadata }: IRouteData): string => {
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

    serverMethod.call(server, routeOptions, [...metadata.middleware.toArray(), ...methodMetadata.middleware.toArray()], handler);

    return routeOptions.path;
};
