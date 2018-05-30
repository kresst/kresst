import { HandlerDecorator } from "../../domain/decorators/HandlerDecorator";
import { RequestHandler } from "restify";
import { ResourceMethodMetadata, ResourceMethodMetadataList, RouteOptions } from "../../domain/decorators/ResourceMethodMetadata";
import { METADATA_KEYS } from "../../domain/Constants";

export const Method = (method: string, options: RouteOptions, ...middleware: Array<RequestHandler>): HandlerDecorator => {
    return (target: any, key: string) => {
        const metadata: ResourceMethodMetadata = {
            options,
            middleware,
            method,
            target,
            key
        };
        let metadataList: ResourceMethodMetadataList = [];
        const metadataKey = METADATA_KEYS.RESOURCE_METHOD;

        if (!Reflect.hasOwnMetadata(metadataKey, target.constructor)) {
            Reflect.defineMetadata(metadataKey, metadataList, target.constructor);
        } else {
            metadataList = Reflect.getOwnMetadata(metadataKey, target.constructor);
        }

        metadataList.push(metadata);
    };
};
