import { METADATA_KEYS } from "../../../domain/constants";
import { IMetadata } from "../../../domain/metadata";
import { tagParameterOrProperty } from "./tagParameterOrProperty";

export const tagProperty = (annotationTarget: any, propertyName: string, metadata: IMetadata<any>): void => {
    tagParameterOrProperty(METADATA_KEYS.TAGGED_PROP, annotationTarget.constructor, propertyName, metadata);
};
