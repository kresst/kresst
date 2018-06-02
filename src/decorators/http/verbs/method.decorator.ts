import { List } from "immutable";
import { RequestHandler } from "restify";
import { METADATA_KEYS } from "../../../domain/constants";
import { HandlerDecorator, ResourceMethodMetadata, ResourceMethodMetadataList } from "../../../domain/decorators";
import { RouteOptions } from "../../../domain/router";

export const Method = (method: string, options: RouteOptions, ...middleware: Array<RequestHandler>): HandlerDecorator => {
    return (target: any, key: string): void => {
        const metadata: ResourceMethodMetadata = {
            options,
            middleware: List(middleware),
            method,
            target,
            key
        };
        let metadataList: ResourceMethodMetadataList = List();

        if (Reflect.hasOwnMetadata(METADATA_KEYS.RESOURCE_METHOD, target.constructor)) {
            metadataList = Reflect.getOwnMetadata(METADATA_KEYS.RESOURCE_METHOD, target.constructor);
        }

        Reflect.defineMetadata(METADATA_KEYS.RESOURCE_METHOD, metadataList.push(metadata), target.constructor);
    };
};
