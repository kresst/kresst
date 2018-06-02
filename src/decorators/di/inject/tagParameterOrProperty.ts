import { List, Map } from "immutable";
import { isNil, isNumber } from "lodash";
import { VError } from "verror";
import { ERROR_MESSAGES } from "../../../domain/constants";
import { IMetadata, IMetadataList, MetadataList } from "../../../domain/metadata";

export const tagParameterOrProperty = (
    metadataKey: symbol,
    annotationTarget: any,
    propertyName: string,
    metadata: IMetadata<any>,
    parameterIndex?: number
): void => {
    const isParameterDecorator = isNumber(parameterIndex);

    // If the decorator is used as a parameter decorator, the property name must be provided
    if (isParameterDecorator && !isNil(propertyName)) {
        throw new VError(ERROR_MESSAGES.INVALID_DECORATOR_OPERATION);
    }

    // Read metadata if available
    let paramsOrPropertiesMetadata: Map<string, MetadataList<any>> = Map(Reflect.getMetadata(metadataKey, annotationTarget));
    const key: string = !isNil(parameterIndex) && isParameterDecorator ? parameterIndex.toString() : propertyName;

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
    Reflect.defineMetadata(metadataKey, paramsOrPropertiesMetadata, annotationTarget);
};
