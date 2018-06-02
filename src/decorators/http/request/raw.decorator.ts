import { METADATA_KEYS } from "../../../domain/constants";
import { HandlerDecorator } from "../../../domain/decorators";

export const Raw: HandlerDecorator = (target: any, propertyKey: string): void => {
    Reflect.defineMetadata(METADATA_KEYS.RAW, true, target, propertyKey);
};
