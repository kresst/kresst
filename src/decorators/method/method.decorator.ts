import { HandlerDecorator } from "../../domain/decorators/HandlerDecorator";
import { RequestHandler } from "restify";
import { ControllerMethodMetadata, ControllerMethodMetadataList, RouteOptions } from "../../domain/decorators/ControllerMethodMetadata";
import { METADATA_KEYS } from "../../domain/Constants";

export const Method = (method: string, options: RouteOptions, ...middleware: Array<RequestHandler>): HandlerDecorator => {
    return (target: any, key: string) => {
        const metadata: ControllerMethodMetadata = {
            options,
            middleware,
            method,
            target,
            key
        };
        let metadataList: ControllerMethodMetadataList = [];
        const metadataKey = METADATA_KEYS.CONTROLLER_METHOD;

        if (!Reflect.hasOwnMetadata(metadataKey, target.constructor)) {
            Reflect.defineMetadata(metadataKey, metadataList, target.constructor);
        } else {
            metadataList = Reflect.getOwnMetadata(metadataKey, target.constructor);
        }

        metadataList.push(metadata);
    };
};
