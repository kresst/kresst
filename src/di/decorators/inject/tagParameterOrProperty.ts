import { ERROR_MESSAGES } from "@kresst/constants";
import { IMetadata, IMetadataList, MetadataList } from "@kresst/core";
import { List, Map } from "immutable";
import { isNil, isNumber } from "lodash";
import { VError } from "verror";

export const tagParameterOrProperty = (
    metadataKey: symbol,
    target: Object,
    propertyKey: string | symbol,
    metadata: IMetadata<any>,
    parameterIndex?: number
): void => {
    const isParameterDecorator = isNumber(parameterIndex);

    // If the decorator is used as a parameter decorator, the property name must be provided
    if (isParameterDecorator && !isNil(propertyKey)) {
        throw new VError(ERROR_MESSAGES.INVALID_DECORATOR_OPERATION);
    }

    // Read metadata if available
    let paramsOrPropertiesMetadata: Map<string | symbol, MetadataList<any>> = Map(Reflect.getMetadata(metadataKey, target));
    const key: string | symbol = !isNil(parameterIndex) && isParameterDecorator ? parameterIndex.toString() : propertyKey;

    // Get metadata for the decorated parameter by its index
    let paramOrPropertyMetadata: IMetadataList<any> = List(paramsOrPropertiesMetadata.get(key));

    paramOrPropertyMetadata.forEach((_metadata: IMetadata<any>) => {
        if (_metadata.key === metadata.key) {
            throw new VError(`${ERROR_MESSAGES.DUPLICATED_METADATA} ${Symbol.keyFor(<symbol>_metadata.key)}`);
        }
    });

    // Set metadata
    paramOrPropertyMetadata = paramOrPropertyMetadata.push(metadata);
    paramsOrPropertiesMetadata = paramsOrPropertiesMetadata.set(key, paramOrPropertyMetadata);
    Reflect.defineMetadata(metadataKey, paramsOrPropertiesMetadata, target);
};
