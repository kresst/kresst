import { METADATA_KEYS } from "@kresst/constants";
import { ModuleConfig, Newable, ResourceMetadata, ResourceMethodMetadata, ResourceMethodMetadataArray } from "@kresst/core";
import { debug } from "@kresst/utils";
import { isNil, padStart } from "lodash";
import { Server } from "restify";
import { resolveConstructor } from "../../../di/internals/resolveConstructor";
import { getResourcePath } from "./getResourcePath";
import { registerRoute } from "./registerRoute";

export const registerResource = (resource: any, moduleConfig: ModuleConfig, server: Server, constructor: Newable) => {
    const instance = resolveConstructor(resource, constructor);
    const metadata: ResourceMetadata<any> = Reflect.getOwnMetadata(METADATA_KEYS.RESOURCE, resource);
    const resourceMethodMetadata: ResourceMethodMetadataArray = Reflect.getOwnMetadata(METADATA_KEYS.RESOURCE_METHOD, resource);

    if (isNil(metadata) || isNil(resourceMethodMetadata)) {
        return;
    }

    debug(moduleConfig, `@Resource discovered: ${metadata.constructor.name}`);

    metadata.path = getResourcePath(moduleConfig, metadata);

    resourceMethodMetadata.forEach((methodMetadata: ResourceMethodMetadata) => {
        const path = registerRoute({
            server,
            instance,
            metadata,
            methodMetadata
        });

        debug(moduleConfig, `=> ${padStart(methodMetadata.method.trim(), 5, " ").toUpperCase()} ${path}`);
    });
};
