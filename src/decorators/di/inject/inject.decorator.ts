import { isNil, isNumber } from "lodash";
import { VError } from "verror";
import { ERROR_MESSAGES, Newable } from "../../../domain";
import { METADATA_KEYS } from "../../../domain/constants";
import { Metadata } from "../../../domain/metadata";
import { tagParameter } from "./tagParameter";
import { tagProperty } from "./tagProperty";

/*
* Class Property or Constructor's Parameter Injection
*
* @Inject() decorator allows to set kresst up to
* inject specific data in place of desired value.
* */
export const Inject = <T>(injectorIdentifier?: string | Newable): any => {
    return (target: T, propertyKey: string | symbol, parameterIndex: number): T => {
        let identifier = injectorIdentifier;

        if (isNil(identifier)) {
            if (isNumber(parameterIndex)) {
                identifier = Reflect.getMetadata(METADATA_KEYS.DESIGN_PARAM_TYPES, target)[parameterIndex];
            } else {
                identifier = Reflect.getMetadata(METADATA_KEYS.DESIGN_TYPE, target, propertyKey);
            }

            if (isNil(identifier)) {
                throw new VError(ERROR_MESSAGES.INVALID_DECORATOR_OPERATION);
            }
        }

        const metadata = new Metadata(METADATA_KEYS.INJECT_TAG, identifier);

        if (isNumber(parameterIndex)) {
            tagParameter(target, propertyKey, parameterIndex, metadata);
        } else {
            tagProperty(target, propertyKey, metadata);
        }

        return target;
    };
};
