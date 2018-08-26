import { METADATA_KEYS } from "@kresst/constants";
import { IMetadata } from "@kresst/core";
import { tagParameterOrProperty } from "@kresst/di";

export const tagProperty = (target: Object, propertyKey: string | symbol, metadata: IMetadata<any>): void => {
    tagParameterOrProperty(METADATA_KEYS.TAGGED_PROP, target.constructor, propertyKey, metadata);
};
