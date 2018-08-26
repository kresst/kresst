import { METADATA_KEYS } from "@kresst/constants";
import { KresstRequestHandler } from "@kresst/http";
import { isNil } from "lodash";
import * as VError from "verror";
import { craftCustomRequestHandler } from "./craftCustomRequestHandler";

export const getRouteHandler = (instance: Object, key: string | symbol): KresstRequestHandler => {
    if (isNil(key)) {
        throw new VError(`Cannot get route handler with name: ${key}`);
    }

    const trimmedKey = key.toString().trim();
    const handler: KresstRequestHandler = (<any>instance)[trimmedKey];

    // If the user asked for a @Raw request, then his handler must
    // be ready to accept server's native options.
    // Usually (res, req, next).
    if (Reflect.getMetadata(METADATA_KEYS.RAW, instance, key) === true) {
        return handler.bind(instance);
    }

    // Else we need to craft a request handler around the user's one
    // in order to handle the returned value and process it.
    return craftCustomRequestHandler(handler, instance, trimmedKey);
};
