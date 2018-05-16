import { Dictionary, isNil, isNumber } from "lodash";
import { Inject } from "../..";
import { ERROR_MESSAGES, METADATA_KEYS } from "../../domain/Constants";
import { IMetadataList, Metadata, MetadataList } from "../../domain/Metadata";
import { Newable } from "../../domain/Newable";
import { VError } from "verror";

export const createInstance = (constructor: Newable, injections: Array<any>): any => new constructor(...injections);

export const extractClassParameters = (constructor: Newable): Array<any> => {
    const parameters: Array<any> = [];
    let parametersInjections: Dictionary<MetadataList> = {};

    if (Reflect.hasMetadata(METADATA_KEYS.TAGGED, constructor)) {
        parametersInjections = Reflect.getMetadata(METADATA_KEYS.TAGGED, constructor);
    }

    Object.keys(parametersInjections).forEach((property: string) => {
        const metadata: IMetadataList = parametersInjections[property];
        const injectorIndex: number = parseInt(property, 10);

        if (!isNumber(injectorIndex) || !isNil(parameters[injectorIndex])) {
            throw new VError(ERROR_MESSAGES.INVALID_DECORATOR_OPERATION);
        }

        const dependencies = metadata.map(({ value }: Metadata) => value);
        parameters[injectorIndex] = dependencies.length === 1 ? dependencies[0] : dependencies;
    });

    return parameters;
};

export const streamlineClassParameters = (constructor: Newable): Newable => {
    let _constructor = constructor;
    let parameters: Array<any> = [];
    let decoratedParameters: Dictionary<MetadataList> = {};

    if (Reflect.hasMetadata(METADATA_KEYS.DESIGN_PARAM_TYPES, constructor)) {
        parameters = Reflect.getMetadata(METADATA_KEYS.DESIGN_PARAM_TYPES, constructor);
    } else if (Reflect.hasMetadata(METADATA_KEYS.PARAM_TYPES, constructor)) {
        parameters = Reflect.getMetadata(METADATA_KEYS.PARAM_TYPES, constructor);
    } else {
        throw new VError(ERROR_MESSAGES.MISSING_INJECTABLE_DECORATOR(constructor.name));
    }

    if (Reflect.hasMetadata(METADATA_KEYS.TAGGED, constructor)) {
        decoratedParameters = Reflect.getMetadata(METADATA_KEYS.TAGGED, constructor);
    }

    parameters.forEach((parameter: any, index: number) => {
        // If the currently parsed parameter has not already been @Inject decorated
        // this does it automatically
        if (isNil(decoratedParameters[`${index}`])) {
            _constructor = Inject(parameter)(constructor, <any>undefined, index);
        }
    });

    return _constructor;
};
