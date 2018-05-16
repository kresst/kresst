import { METADATA_KEYS } from "./Constants";
import { toString } from "lodash";

export type MetadataKey = string | number | symbol;

export interface IMetadata {
    key: MetadataKey;
    value: any;
}

export type IMetadataList = Array<IMetadata>;

export class Metadata implements IMetadata {
    public key: MetadataKey;
    public value: any;

    constructor(key: MetadataKey, value: any) {
        this.key = key;
        this.value = value;
    }

    public toString(): string {
        if (this.key === METADATA_KEYS.NAMED_TAG) {
            return `Named: ${toString(this.value)} `;
        }
        return `Tagged: { key:${toString(this.key)}, value: ${this.value} }`;
    }
}

export type MetadataList = Array<Metadata>;
