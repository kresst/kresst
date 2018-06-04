import { METADATA_KEYS } from "../../../domain/constants";
import { IMetadata } from "../../../domain/metadata";
import { tagParameterOrProperty } from "./tagParameterOrProperty";

export const tagProperty = (target: Object, propertyKey: string | symbol, metadata: IMetadata<any>): void => {
    tagParameterOrProperty(METADATA_KEYS.TAGGED_PROP, target.constructor, propertyKey, metadata);
};
