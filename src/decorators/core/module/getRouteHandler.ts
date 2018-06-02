import { KresstRequestHandler, METADATA_KEYS } from "../../../domain";
import { craftCustomRequestHandler } from "./craftCustomRequestHandler";

export const getRouteHandler = (instance: any, key: string): KresstRequestHandler => {
    const handler: KresstRequestHandler = instance[key.trim()];

    // If the user asked for a @Raw request, then his handler must
    // be ready to accept server's native options.
    // Usually (res, req, next).
    if (Reflect.getMetadata(METADATA_KEYS.RAW, instance, key) === true) {
        return handler.bind(instance);
    }

    // Else we need to craft a request handler around the user's one
    // in order to handle the returned value and process it.
    return craftCustomRequestHandler(handler, instance);
};
