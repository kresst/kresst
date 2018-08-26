import { ERROR_MESSAGES, METADATA_KEYS } from "@kresst/constants";
import { Newable } from "@kresst/core";
import { VError } from "verror";

/*
* @Injectable Factory
*/
export const makeInjectable = <T extends Newable>(constructor: T): T => {
    if (Reflect.hasOwnMetadata(METADATA_KEYS.PARAM_TYPES, constructor)) {
        throw new VError(ERROR_MESSAGES.DUPLICATED_INJECTABLE_DECORATOR);
    }

    const types = Reflect.getMetadata(METADATA_KEYS.DESIGN_PARAM_TYPES, constructor) || [];
    Reflect.defineMetadata(METADATA_KEYS.PARAM_TYPES, types, constructor);

    return constructor;
};
