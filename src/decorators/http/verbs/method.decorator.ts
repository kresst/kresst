import { List } from "immutable";
import { RequestHandler } from "restify";
import { METADATA_KEYS } from "../../../domain/constants";
import { ResourceMethodMetadata, ResourceMethodMetadataList } from "../../../domain/decorators";
import { RouteOptions } from "../../../domain/router";

export const Method = (method: string, options: RouteOptions, ...middleware: Array<RequestHandler>): MethodDecorator => {
    return (target: Object, propertyKey: string | symbol): void => {
        const metadata: ResourceMethodMetadata = {
            options,
            middleware: List(middleware),
            method,
            target,
            key: propertyKey
        };
        let metadataList: ResourceMethodMetadataList = List();

        if (Reflect.hasOwnMetadata(METADATA_KEYS.RESOURCE_METHOD, target.constructor)) {
            metadataList = Reflect.getOwnMetadata(METADATA_KEYS.RESOURCE_METHOD, target.constructor);
        }

        Reflect.defineMetadata(METADATA_KEYS.RESOURCE_METHOD, metadataList.push(metadata), target.constructor);
    };
};
