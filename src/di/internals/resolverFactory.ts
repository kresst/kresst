import { Iterable } from "immutable";
import { Newable, NewableLike } from "../../core/domain/Newable";
import { createInstance } from "./createInstance";
import { extractClassProperties } from "./extractClassProperties";
import { extractConstructorParams } from "./extractConstructorParams";
import { hydrateInstance } from "./hydrateInstance";
import { parseConstructorParams } from "./parseConstructorParams";

/*
* Instance Resolution
*
* Resolves and returns a brand new fully hydrated instance of given
* constructor.
* */
export const resolverFactory = <T extends Newable>(constructor: T): T => {
    const parsedConstructor = parseConstructorParams(constructor);

    const paramsToInject: Array<NewableLike> = extractConstructorParams(parsedConstructor)
        .map((token: T) => resolverFactory(token))
        .toArray();

    const instance = createInstance(parsedConstructor, paramsToInject);

    const resolvedPropertiesToInject: Iterable<string, T> = extractClassProperties(parsedConstructor).map((value: T) =>
        resolverFactory(value)
    );

    return hydrateInstance(resolvedPropertiesToInject, instance);
};
