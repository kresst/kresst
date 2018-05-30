import { isArray, isBoolean, isNil, isRegExp, isString, padStart } from "lodash";
import { RequestHandler, Server } from "restify";
import { ERROR_MESSAGES, METADATA_KEYS } from "../../domain/Constants";
import { Resource } from "../../domain/decorators/Resource";
import { ResourceMetadata } from "../../domain/decorators/ResourceMetadata";
import { ResourceMethodMetadata, ResourceMethodMetadataList } from "../../domain/decorators/ResourceMethodMetadata";
import { ModuleConfig } from "../../domain/decorators/ModuleConfig";
import { Newable } from "../../domain/Newable";
import { resolve } from "../resolver/resolver";

interface RouteData {
    server: Server;
    instance: any;
    metadata: ResourceMetadata<any>;
    middleware: Array<RequestHandler>;
    methodMetadata: ResourceMethodMetadata;
}

const dedupeSlashes = (value: string) => {
    return value.replace(/(\/)\/+/g, "$1").replace(/\/$/, "");
};

const debug = (moduleConfig: ModuleConfig, message: any) => {
    if (isBoolean(moduleConfig.debug) && moduleConfig.debug) {
        if (isNil(moduleConfig.logger)) {
            console.log(message);
        } else {
            moduleConfig.logger.debug(message);
        }
    }
};

const getResourcePath = (moduleConfig: ModuleConfig, resourceMetadata: ResourceMetadata<any>): string => {
    let resourceMetadataPath = "/";

    if (isString(moduleConfig.basePath)) {
        resourceMetadataPath += moduleConfig.basePath.trim();
    }

    if (isString(resourceMetadata.path)) {
        resourceMetadataPath += `/${resourceMetadata.path.trim()}`;
    }

    return dedupeSlashes(resourceMetadataPath);
};

const getServerMethod = (server: any, { key, method }: ResourceMethodMetadata): Function => {
    if (!isString(method)) {
        throw new Error(ERROR_MESSAGES.METHOD_MUST_BE_A_STRING(key, method));
    }

    const serverMethod = server[method.toLowerCase().trim()];
    if (isNil(serverMethod)) {
        throw new Error(ERROR_MESSAGES.UNRECOGNIZED_SERVER_METHOD(key, method));
    }

    return serverMethod;
};

const registerRoute = ({ server, instance, metadata, middleware, methodMetadata }: RouteData): string => {
    const serverMethod: Function = getServerMethod(server, methodMetadata);
    const handler: RequestHandler = instance[methodMetadata.key.trim()].bind(instance);

    const routeOptions: any = isString(methodMetadata.options) ? { path: methodMetadata.options } : methodMetadata.options;

    const routeMiddleware = isArray(methodMetadata.middleware) ? methodMetadata.middleware : [];

    if (isString(metadata.path) && metadata.path.length > 0) {
        if (isString(routeOptions.path)) {
            routeOptions.path = dedupeSlashes(`/${metadata.path}/${routeOptions.path}`);
        } else if (isRegExp(routeOptions.path)) {
            const path = dedupeSlashes(`${metadata.path}/${routeOptions.path.source}`);
            routeOptions.path = new RegExp(path);
        }
    }

    serverMethod.call(server, routeOptions, [...middleware, ...routeMiddleware], handler);

    return routeOptions.path;
};

const registerResource = (resource: any, moduleConfig: ModuleConfig, server: Server, constructor: Newable) => {
    const instance = resolve(resource, constructor);

    const metadata: ResourceMetadata<any> = Reflect.getOwnMetadata(METADATA_KEYS.RESOURCE, resource);

    const resourceMethodMetadataList: ResourceMethodMetadataList = Reflect.getOwnMetadata(METADATA_KEYS.RESOURCE_METHOD, resource);

    if (isNil(metadata) || isNil(resourceMethodMetadataList)) {
        return;
    }

    debug(moduleConfig, `@Resource discovered: ${metadata.constructor.name}`);

    metadata.path = getResourcePath(moduleConfig, metadata);

    const middleware = isArray(metadata.middleware) ? metadata.middleware : [];

    resourceMethodMetadataList.forEach((methodMetadata: ResourceMethodMetadata) => {
        const path = registerRoute({
            server,
            instance,
            metadata,
            middleware,
            methodMetadata
        });

        debug(moduleConfig, `=> ${padStart(methodMetadata.method.trim(), 5, " ").toUpperCase()} ${path}`);
    });
};

const registerResources = (constructor: Newable, moduleConfig: ModuleConfig, server: Server) => {
    if (isArray(moduleConfig.resources)) {
        moduleConfig.resources.forEach((resource: Resource) => {
            registerResource(resource, moduleConfig, server, constructor);
        });
    }
};

// const registerProviders = (constructor: Newable, moduleConfig: ModuleConfig) => {
// if (isArray(moduleConfig.providers)) {
//     const providers: Dictionary<Newable> = {};
//
//     moduleConfig.providers.forEach((provider: Newable) => {
//         if (isUndefined(providers[ provider.name ])) {
//             providers[ provider.name ] = <Newable>new provider();
//         } else {
//             throw new Error(`${ERROR_MESSAGES.DUPLICATED_PROVIDER} ${provider.name}`);
//         }
//     });
//
//     Reflect.defineMetadata(METADATA_KEYS.MODULE_PROVIDERS, providers, constructor);
// }
// };

export const Module = (moduleConfig: ModuleConfig) => {
    return <T extends Newable>(constructor: T) => {
        const module: any = function(...args: Array<any>) {
            constructor.apply(this, args);

            Reflect.defineMetadata(METADATA_KEYS.MODULE_CONFIG, moduleConfig, constructor);

            // registerProviders(constructor, moduleConfig);
            registerResources(constructor, moduleConfig, <Server>this[moduleConfig.restify]);
        };

        module.prototype = constructor.prototype;

        return module;
    };
};
