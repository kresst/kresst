import { METADATA_KEYS } from "@kresst/constants";
import { List } from "immutable";
import { isArray, isFunction, isNil, isObject, merge } from "lodash";
import Optional from "typescript-optional";

const castTo = (value: any, type: any): any => {
    if (isNil(value)) {
        return value;
    }

    return type(value);
};

export const castHandlerValuesToTypes = (values: List<any>, instance: Object, key: string): List<any> => {
    const valueTypes: List<any> = List(Reflect.getMetadata(METADATA_KEYS.DESIGN_PARAM_TYPES, instance, key));

    return values
        .map((value: any, index: number): any => {
            const type = valueTypes.get(index);

            switch (type) {
                case Optional:
                    value = Optional.ofNullable(value);
                    break;
                case Number:
                    value = castTo(value, Number);
                    break;
                case String:
                    value = castTo(value, String);
                    break;
                case Boolean:
                    value = Boolean(value);
                    break;
                case Array:
                    if (!isArray(value)) {
                        value = Array(value);
                    }
                    break;
                default:
                    if (isObject(value) && isFunction(type)) {
                        const clazz = new (<any>type)();
                        value = merge(clazz, value);
                    }
            }

            return value;
        })
        .toList();
};
