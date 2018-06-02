import { METADATA_KEYS } from "../../../domain/constants";
import { IMetadata } from "../../../domain/metadata";
import { tagParameterOrProperty } from "./tagParameterOrProperty";

export const tagParameter = (annotationTarget: any, propertyName: string, parameterIndex: number, metadata: IMetadata<any>): void => {
    tagParameterOrProperty(METADATA_KEYS.TAGGED, annotationTarget, propertyName, metadata, parameterIndex);
};
