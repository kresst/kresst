import { METADATA_KEYS } from "../../../domain/constants";
import { IMetadata } from "../../../domain/metadata";
import { tagParameterOrProperty } from "./tagParameterOrProperty";

export const tagParameter = (target: Object, propertyKey: string | symbol, parameterIndex: number, metadata: IMetadata<any>): void => {
    tagParameterOrProperty(METADATA_KEYS.TAGGED, target, propertyKey, metadata, parameterIndex);
};
