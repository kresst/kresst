import { Dictionary, isNil } from "lodash";
import { METADATA_KEYS } from "../../domain/Constants";
import { Newable } from "../../domain/Newable";
import { createInstance, extractClassParameters, streamlineClassParameters } from "./instance.resolver";
import { extractClassProperties, injectClassProperties } from "./properties.resolver";

const _resolverFactory = (constructor: Newable): any => {
    const _constructor = streamlineClassParameters(constructor);

    const paramsToInject = extractClassParameters(constructor).map((token: any) => _resolverFactory(token));
    const propertiesToInject: Dictionary<any> = extractClassProperties(constructor);
    Object.keys(propertiesToInject).forEach((property: string) => {
        propertiesToInject[property] = _resolverFactory(propertiesToInject[property]);
    });

    const instance = createInstance(_constructor, paramsToInject);
    return injectClassProperties(propertiesToInject, instance);
};

export const resolve = (constructor: Newable, target?: Newable): any => {
    let instances: Dictionary<Newable> = {};

    // Read existing instances if available
    if (!isNil(target) && Reflect.hasMetadata(METADATA_KEYS.MODULE_PROVIDERS, target)) {
        instances = Reflect.getMetadata(METADATA_KEYS.MODULE_PROVIDERS, target);
    }

    // Return already resolved instance if it exists
    if (instances.hasOwnProperty(constructor.name) && !isNil(instances[constructor.name])) {
        return instances[constructor.name];
    }

    // Resolve new instance with all required providers and sub-providers
    const instance = _resolverFactory(constructor);
    instances[constructor.name] = instance;

    // Save the instance as singleton
    if (!isNil(target)) {
        Reflect.defineMetadata(METADATA_KEYS.MODULE_PROVIDERS, instances, target);
    }

    return instance;
};
