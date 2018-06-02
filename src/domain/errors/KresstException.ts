import { Dictionary } from "lodash";
import { HttpStatus } from "../http/HttpStatus";

export class KresstException extends Error {
    public readonly id: string;
    public readonly data: Map<string, string> = new Map<string, string>();
    public readonly error: string;
    public readonly errorTime: Date;
    public readonly description: string;
    public readonly errorStatus: HttpStatus;

    constructor(id: string, errorTime: Date, errorStatus: HttpStatus, error: string, description: string, data: Map<string, string>) {
        super(`[${errorTime}] [${id}] [${HttpStatus.getCode(errorStatus)}~${error}] ${description} - ${data}`);

        this.id = id;
        this.data = data;
        this.error = error;
        this.errorTime = errorTime;
        this.errorStatus = errorStatus;
        this.description = description;
    }

    public toJSON(): string {
        const data: Dictionary<any> = {
            id: this.id,
            data: {},
            errorCode: this.error,
            errorTime: this.errorTime,
            description: this.description
        };

        this.data.forEach((value: string, key: string) => {
            data.data[key] = value;
        });

        return JSON.stringify(data);
    }

    public toString(): string {
        return this.toJSON();
    }
}
