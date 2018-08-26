import { ERROR_MESSAGES, METADATA_KEYS } from "@kresst/constants";
import { Metadata, MetadataArray, Newable } from "@kresst/core";
import { Map } from "immutable";
import { isNil } from "lodash";
import { VError } from "verror";

/*
* Class Property Extraction
*
* Finds and returns a Immutable.Map containing all properties
* of given class which need to be injected.
* */
export const extractClassProperties = <T extends Newable>(constructor: T): Map<string, Newable> => {
    const propertiesInjections: Map<string, MetadataArray<Newable>> = Map(Reflect.getMetadata(METADATA_KEYS.TAGGED_PROP, constructor));

    // Nothing to inject, we are clear
    if (propertiesInjections.size === 0) {
        return Map();
    }

    let properties: Map<string, Newable> = Map();

    // Extract all required dependencies
    propertiesInjections.forEach((metadata: MetadataArray<Newable>, property: string) => {
        metadata.forEach(({ value }: Metadata<Newable>) => {
            // Preventing programmatic duplicated property
            if (!isNil(properties.get(property))) {
                throw new VError(ERROR_MESSAGES.INVALID_DECORATOR_OPERATION);
            }

            properties = properties.set(property, value);
        });
    });

    return properties;
};
