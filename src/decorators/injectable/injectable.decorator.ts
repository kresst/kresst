import { ERROR_MESSAGES, METADATA_KEYS } from "../../domain/Constants";
import { Newable } from "../../domain/Newable";

export const makeInjectable = <T extends Newable>(constructor: T) => {
    if (Reflect.hasOwnMetadata(METADATA_KEYS.PARAM_TYPES, constructor)) {
        throw new Error(ERROR_MESSAGES.DUPLICATED_INJECTABLE_DECORATOR);
    }

    const types = Reflect.getMetadata(METADATA_KEYS.DESIGN_PARAM_TYPES, constructor) || [];
    Reflect.defineMetadata(METADATA_KEYS.PARAM_TYPES, types, constructor);

    return constructor;
};

export const Injectable = () => {
    return <T extends Newable>(constructor: T) => {
        return makeInjectable(constructor);
    };
};
