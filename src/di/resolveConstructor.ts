import { Map } from "immutable";
import { isNil } from "lodash";
import { METADATA_KEYS } from "../domain/constants/METADATA_KEYS";
import { Newable } from "../domain/Newable";
import { resolverFactory } from "./resolverFactory";

/*
* Constructor Resolution
*
* Creates or returns an instance as a singleton from given constructor.
* */
export const resolveConstructor = (constructor: Newable, target?: Newable): any => {
    let instances: Map<string, Newable> = Map();

    // Read existing instances if available
    if (!isNil(target) && Reflect.hasMetadata(METADATA_KEYS.MODULE_PROVIDERS, target)) {
        instances = Reflect.getMetadata(METADATA_KEYS.MODULE_PROVIDERS, target);
    }

    // Return already resolved instance if it exists
    if (!isNil(instances.get(constructor.name))) {
        return instances.get(constructor.name);
    }

    // Resolve new instance with all required providers and sub-providers
    const instance = resolverFactory(constructor);

    // Save the instance as singleton
    if (!isNil(target)) {
        Reflect.defineMetadata(METADATA_KEYS.MODULE_PROVIDERS, instances.set(constructor.name, instance), target);
    }

    return instance;
};
