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
export const Inject = (injectorIdentifier?: string | Newable) => {
    return (target: any, targetKey: string, index?: number): any => {
        let identifier = injectorIdentifier;

        if (isNil(identifier)) {
            if (isNumber(index)) {
                identifier = Reflect.getMetadata(METADATA_KEYS.DESIGN_PARAM_TYPES, target)[index];
            } else {
                identifier = Reflect.getMetadata(METADATA_KEYS.DESIGN_TYPE, target, targetKey);
            }

            if (isNil(identifier)) {
                throw new VError(ERROR_MESSAGES.INVALID_DECORATOR_OPERATION);
            }
        }

        const metadata = new Metadata(METADATA_KEYS.INJECT_TAG, identifier);

        if (isNumber(index)) {
            tagParameter(target, targetKey, index, metadata);
        } else {
            tagProperty(target, targetKey, metadata);
        }

        return target;
    };
};
