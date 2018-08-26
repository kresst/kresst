import { METADATA_KEYS } from "../../../constants/index";

export const Raw: MethodDecorator = (target: Object, propertyKey: string | symbol): void => {
    Reflect.defineMetadata(METADATA_KEYS.RAW, true, target, propertyKey);
};
