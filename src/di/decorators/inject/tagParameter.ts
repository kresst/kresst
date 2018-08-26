import { METADATA_KEYS } from "@kresst/constants";
import { IMetadata } from "@kresst/core";
import { tagParameterOrProperty } from "@kresst/di";

export const tagParameter = (target: Object, propertyKey: string | symbol, parameterIndex: number, metadata: IMetadata<any>): void => {
    tagParameterOrProperty(METADATA_KEYS.TAGGED, target, propertyKey, metadata, parameterIndex);
};
