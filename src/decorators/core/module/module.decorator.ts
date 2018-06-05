import { Server } from "restify";
import { METADATA_KEYS, ModuleConfig, Newable } from "../../../domain/index";
import { registerResources } from "./internals/registerResources";

// const registerProviders = (constructor: Newable, moduleConfig: ModuleConfig) => {
// if (isArray(moduleConfig.providers)) {
//     const providers: Dictionary<Newable> = {};
//
//     moduleConfig.providers.forEach((provider: Newable) => {
//         if (isUndefined(providers[ provider.name ])) {
//             providers[ provider.name ] = <Newable>new provider();
//         } else {
//             throw new VError(`${ERROR_MESSAGES.DUPLICATED_PROVIDER} ${provider.name}`);
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
