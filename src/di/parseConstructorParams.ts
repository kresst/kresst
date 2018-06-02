import { List, Map } from "immutable";
import { isNil } from "lodash";
import { VError } from "verror";
import { ERROR_MESSAGES, Inject, METADATA_KEYS, MetadataList, Newable } from "..";

/*
* Class Constructor Parameters Streamlining
*
* Parses all given class constructor's parameters and
* auto-magically @Inject them if not already @Inject-ed.
* This allows for simpler parsing algorithm later on in resolverFactory.
* */
export const parseConstructorParams = <T extends Newable>(constructor: T): T => {
    let constructorRef = constructor;
    let constructorParams: List<Newable> = List();
    const decoratedParams: Map<string, MetadataList<Newable>> = Map(Reflect.getMetadata(METADATA_KEYS.TAGGED, constructor));

    if (Reflect.hasMetadata(METADATA_KEYS.DESIGN_PARAM_TYPES, constructor)) {
        constructorParams = List(Reflect.getMetadata(METADATA_KEYS.DESIGN_PARAM_TYPES, constructor));
    } else if (Reflect.hasMetadata(METADATA_KEYS.PARAM_TYPES, constructor)) {
        constructorParams = List(Reflect.getMetadata(METADATA_KEYS.PARAM_TYPES, constructor));
    } else {
        throw new VError(ERROR_MESSAGES.MISSING_INJECTABLE_DECORATOR(constructor.name));
    }

    constructorParams.forEach((parameter: Newable, index: number) => {
        // If the currently parsed parameter has not already been @Inject decorated
        // this does it automatically
        if (isNil(decoratedParams.get(`${index}`))) {
            constructorRef = Inject(parameter)(constructorRef, <any>undefined, index);
        }
    });

    return constructorRef;
};
