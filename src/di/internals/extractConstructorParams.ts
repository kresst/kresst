import { ERROR_MESSAGES, METADATA_KEYS } from "@kresst/constants";
import { Metadata, MetadataList, Newable, NewableLike } from "@kresst/core";
import { List, Map } from "immutable";
import { isNil, isNumber } from "lodash";
import { VError } from "verror";

/*
* Class Constructor Extraction
*
* Finds and returns a Immutable.List containing all parameters
* of given class constructor which need to be injected.
* */
export const extractConstructorParams = <T extends Newable>(constructor: T): List<NewableLike> => {
    let parameters: List<NewableLike> = List();
    const parametersInjections: Map<string, MetadataList<Newable>> = Map(Reflect.getMetadata(METADATA_KEYS.TAGGED, constructor));

    parametersInjections.forEach((metadata: MetadataList<Newable>, property: string) => {
        const injectorIndex: number = parseInt(property, 10);

        if (!isNumber(injectorIndex) || !isNil(parameters.get(injectorIndex))) {
            throw new VError(ERROR_MESSAGES.INVALID_DECORATOR_OPERATION);
        }

        const dependencies = metadata.map(({ value }: Metadata<Newable>) => value).toList();
        parameters = parameters.set(injectorIndex, dependencies.size === 1 ? dependencies.get(0) : dependencies);
    });

    return parameters;
};
