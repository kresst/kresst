import { List } from "immutable";
import { METADATA_KEYS } from "../../../constants/index";

export enum ParamLocation {
    BODY = "BODY",
    PATH = "PATH",
    QUERY = "QUERY",
    HEADER = "HEADER"
}

export const Param = (location: ParamLocation = ParamLocation.PATH): any => {
    return (target: Object, propertyKey: string | symbol, parameterIndex: number): void => {
        let paramMetadata: List<ParamLocation> = List();

        if (Reflect.hasMetadata(METADATA_KEYS.PARAM, target, propertyKey)) {
            paramMetadata = Reflect.getMetadata(METADATA_KEYS.PARAM, target, propertyKey);
        }

        Reflect.defineMetadata(METADATA_KEYS.PARAM, paramMetadata.set(parameterIndex, location), target, propertyKey);
    };
};
