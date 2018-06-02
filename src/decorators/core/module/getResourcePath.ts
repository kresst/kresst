import { ModuleConfig, ResourceMetadata } from "../../../domain";
import { dedupeSlashes } from "../../../utils";
import { isString } from "lodash";

export const getResourcePath = (moduleConfig: ModuleConfig, resourceMetadata: ResourceMetadata<any>): string => {
    let resourceMetadataPath = "/";

    if (isString(moduleConfig.basePath)) {
        resourceMetadataPath += moduleConfig.basePath.trim();
    }

    if (isString(resourceMetadata.path)) {
        resourceMetadataPath += `/${resourceMetadata.path.trim()}`;
    }

    return dedupeSlashes(resourceMetadataPath);
};
