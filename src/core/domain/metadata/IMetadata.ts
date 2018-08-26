import { List } from "immutable";
import { MetadataKey } from "./MetadataKey";

export interface IMetadata<T> {
    key: MetadataKey;
    value: T;
}

export type IMetadataList<T> = List<IMetadata<T>>;
export type IMetadataArray<T> = Array<IMetadata<T>>;
export type IMetadataLike<T> = IMetadata<T> | IMetadataList<T> | IMetadataArray<T>;
