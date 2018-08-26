import { Iterable } from "immutable";
import { Newable } from "../../core/domain/Newable";

/*
* Instance Hydration
*
* Apply each supplied resolved properties to the given instance.
* */
export const hydrateInstance = <T extends Newable>(resolvedProperties: Iterable<string, any>, instance: T): T => {
    resolvedProperties.forEach((dependencies: any, property: string) => {
        (<any>instance)[property] = dependencies.length === 1 ? dependencies[0] : dependencies;
    });

    return instance;
};
