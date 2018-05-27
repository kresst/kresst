import { ERROR_MESSAGES, METADATA_KEYS } from "../../domain/Constants";
import { Dictionary, isArray, isNumber, isUndefined } from "lodash";
import { IMetadata, IMetadataList, Metadata, MetadataList } from "../../domain/decorators/Metadata";

const _tagParameterOrProperty = (
    metadataKey: symbol,
    annotationTarget: any,
    propertyName: string,
    metadata: IMetadata,
    parameterIndex?: number
): void => {
    let paramsOrPropertiesMetadata: Dictionary<MetadataList> = {};
    const isParameterDecorator = isNumber(parameterIndex);
    const key: string = !isUndefined(parameterIndex) && isParameterDecorator ? parameterIndex.toString() : propertyName;

    // If the decorator is used as a parameter decorator, the property name must be provided
    if (isParameterDecorator && !isUndefined(propertyName)) {
        throw new Error(ERROR_MESSAGES.INVALID_DECORATOR_OPERATION);
    }

    // Read metadata if available
    if (Reflect.hasOwnMetadata(metadataKey, annotationTarget)) {
        paramsOrPropertiesMetadata = Reflect.getMetadata(metadataKey, annotationTarget);
    }

    // Get metadata for the decorated parameter by its index
    let paramOrPropertyMetadata: IMetadataList = paramsOrPropertiesMetadata[key];

    if (!isArray(paramOrPropertyMetadata)) {
        paramOrPropertyMetadata = [];
    } else {
        for (const m of paramOrPropertyMetadata) {
            if (m.key === metadata.key) {
                throw new Error(`${ERROR_MESSAGES.DUPLICATED_METADATA} ${Symbol.keyFor(<symbol>m.key)}`);
            }
        }
    }

    // Set metadata
    paramOrPropertyMetadata.push(metadata);
    paramsOrPropertiesMetadata[key] = paramOrPropertyMetadata;
    Reflect.defineMetadata(metadataKey, paramsOrPropertiesMetadata, annotationTarget);
};

const tagParameter = (annotationTarget: any, propertyName: string, parameterIndex: number, metadata: IMetadata): void => {
    _tagParameterOrProperty(METADATA_KEYS.TAGGED, annotationTarget, propertyName, metadata, parameterIndex);
};

const tagProperty = (annotationTarget: any, propertyName: string, metadata: IMetadata): void => {
    _tagParameterOrProperty(METADATA_KEYS.TAGGED_PROP, annotationTarget.constructor, propertyName, metadata);
};

export const Inject = (injectorIdentifier?: any) => {
    return (target: any, targetKey: string, index?: number): any => {
        let identifier = injectorIdentifier;

        if (isUndefined(injectorIdentifier)) {
            if (isNumber(index)) {
                identifier = Reflect.getMetadata(METADATA_KEYS.DESIGN_PARAM_TYPES, target)[index];
            } else {
                identifier = Reflect.getMetadata("design:type", target, targetKey);
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
