import { Dictionary, isNil } from "lodash";
import { ERROR_MESSAGES, METADATA_KEYS } from "../../domain/Constants";
import { IMetadataList, Metadata, MetadataList } from "../../domain/decorators/Metadata";
import { Newable } from "../../domain/Newable";
import { VError } from "verror";

export const extractClassProperties = (constructor: Newable): Dictionary<any> => {
    const properties: Dictionary<any> = {};
    const propertiesInjections: Dictionary<MetadataList> = Reflect.getMetadata(METADATA_KEYS.TAGGED_PROP, constructor);

    if (!isNil(propertiesInjections)) {
        // Extract all required dependencies
        Object.keys(propertiesInjections).forEach((property: string) => {
            const metadata: IMetadataList = propertiesInjections[property];
            metadata.forEach(({ value }: Metadata) => {
                // Preventing programmatic duplicated property
                if (!isNil(properties[property])) {
                    throw new VError(ERROR_MESSAGES.INVALID_DECORATOR_OPERATION);
                }

                properties[property] = value;
            });
        });
    }

    return properties;
};

export const injectClassProperties = (resolvedProperties: Dictionary<any>, instance: Newable): any => {
    Object.keys(resolvedProperties).forEach((property: string) => {
        const dependencies = resolvedProperties[property];
        (<any>instance)[property] = dependencies.length === 1 ? dependencies[0] : dependencies;
    });

    return instance;
};
