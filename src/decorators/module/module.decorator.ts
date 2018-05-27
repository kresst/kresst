import { isArray, isBoolean, isNil, isRegExp, isString, padStart } from "lodash";
import { RequestHandler, Server } from "restify";
import { ERROR_MESSAGES, METADATA_KEYS } from "../../domain/Constants";
import { Controller } from "../../domain/decorators/Controller";
import { ControllerMetadata } from "../../domain/decorators/ControllerMetadata";
import { ControllerMethodMetadata, ControllerMethodMetadataList } from "../../domain/decorators/ControllerMethodMetadata";
import { ModuleConfig } from "../../domain/decorators/ModuleConfig";
import { Newable } from "../../domain/Newable";
import { resolve } from "../resolver/resolver";

interface RouteData {
    server: Server;
    instance: any;
    metadata: ControllerMetadata<any>;
    middleware: Array<RequestHandler>;
    methodMetadata: ControllerMethodMetadata;
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

const getControllerPath = (moduleConfig: ModuleConfig, controllerMetadata: ControllerMetadata<any>): string => {
    let controllerMetadataPath = "/";

    if (isString(moduleConfig.basePath)) {
        controllerMetadataPath += moduleConfig.basePath.trim();
    }

    if (isString(controllerMetadata.path)) {
        controllerMetadataPath += `/${controllerMetadata.path.trim()}`;
    }

    return dedupeSlashes(controllerMetadataPath);
};

const getServerMethod = (server: any, { key, method }: ControllerMethodMetadata): Function => {
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

const registerController = (controller: any, moduleConfig: ModuleConfig, server: Server, constructor: Newable) => {
    const instance = resolve(controller, constructor);

    const metadata: ControllerMetadata<any> = Reflect.getOwnMetadata(METADATA_KEYS.CONTROLLER, controller);

    const controllerMethodMetadataList: ControllerMethodMetadataList = Reflect.getOwnMetadata(METADATA_KEYS.CONTROLLER_METHOD, controller);

    if (isNil(metadata) || isNil(controllerMethodMetadataList)) {
        return;
    }

    debug(moduleConfig, `@Controller discovered: ${metadata.constructor.name}`);

    metadata.path = getControllerPath(moduleConfig, metadata);

    const middleware = isArray(metadata.middleware) ? metadata.middleware : [];

    controllerMethodMetadataList.forEach((methodMetadata: ControllerMethodMetadata) => {
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

const registerControllers = (constructor: Newable, moduleConfig: ModuleConfig, server: Server) => {
    if (isArray(moduleConfig.controllers)) {
        moduleConfig.controllers.forEach((controller: Controller) => {
            registerController(controller, moduleConfig, server, constructor);
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
            registerControllers(constructor, moduleConfig, <Server>this[moduleConfig.restify]);
        };

        module.prototype = constructor.prototype;

        return module;
    };
};
