import { List } from "immutable";
import { toString } from "lodash";
import { METADATA_KEYS } from "../../../constants/METADATA_KEYS";
import { IMetadata } from "./IMetadata";
import { MetadataKey } from "./MetadataKey";

export class Metadata<T> implements IMetadata<T> {
    public key: MetadataKey;
    public value: T;

    constructor(key: MetadataKey, value: T) {
        this.key = key;
        this.value = value;
    }

    public toString(): string {
        if (this.key === METADATA_KEYS.NAMED_TAG) {
            return `Named: ${toString(this.value)}`;
        }
        return `Tagged: { key: ${toString(this.key)}, value: ${this.value} }`;
    }
}

export type MetadataList<T> = List<Metadata<T>>;
export type MetadataArray<T> = Array<Metadata<T>>;
export type MetadataLike<T> = Metadata<T> | MetadataList<T> | MetadataArray<T>;
