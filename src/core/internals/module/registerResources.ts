import { IResource, ModuleConfig, Newable } from "@kresst/core";
import { isArray } from "lodash";
import { Server } from "restify";
import { registerResource } from "./registerResource";

export const registerResources = (constructor: Newable, moduleConfig: ModuleConfig, server: Server) => {
    if (isArray(moduleConfig.resources)) {
        moduleConfig.resources.forEach((resource: IResource) => {
            registerResource(resource, moduleConfig, server, constructor);
        });
    }
};
