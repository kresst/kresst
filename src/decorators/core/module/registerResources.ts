import { isArray } from "lodash";
import { Server } from "restify";
import { IResource, ModuleConfig, Newable } from "../../../domain";
import { registerResource } from "./registerResource";

export const registerResources = (constructor: Newable, moduleConfig: ModuleConfig, server: Server) => {
    if (isArray(moduleConfig.resources)) {
        moduleConfig.resources.forEach((resource: IResource) => {
            registerResource(resource, moduleConfig, server, constructor);
        });
    }
};
