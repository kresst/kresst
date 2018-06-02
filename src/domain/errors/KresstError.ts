import { isNil } from "lodash";
import { v4 as uuid } from "uuid";
import { HttpStatus } from "../http/HttpStatus";
import { KresstException } from "./KresstException";

export class KresstError<T> {
    public readonly id: string;
    public readonly data: Map<string, string> = new Map<string, string>();
    public readonly error: string;
    public readonly description: string;
    public readonly errorStatus: HttpStatus;

    constructor(errorStatus: HttpStatus, error: string, description: string, id: string = uuid()) {
        this.id = id;
        this.error = error;
        this.errorStatus = errorStatus;
        this.description = description;
    }

    public set(field: string, value: string): KresstError<T> {
        if (!isNil(value)) {
            this.data.set(field, value);
        }

        return this;
    }

    public raise(): KresstException {
        return new KresstException(
            this.id,
            new Date(),
            this.errorStatus,
            this.error,
            this.description,
            new Map<string, string>(this.data.entries())
        );
    }
}
