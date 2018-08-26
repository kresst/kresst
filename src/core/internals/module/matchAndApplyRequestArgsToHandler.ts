import { KresstRequestResult, SimpleRequestHandler } from "@kresst/http";
import { List } from "immutable";
import { Request } from "restify";
import { castHandlerValuesToTypes } from "./castHandlerValuesToTypes";
import { extractHandlerParamNames } from "./extractHandlerParamNames";
import { mapHandlerParamsToValues } from "./mapHandlerParamsToValues";

export const matchAndApplyRequestArgsToHandler = (
    request: Request,
    handler: SimpleRequestHandler,
    instance: Object,
    key: string
): KresstRequestResult => {
    const handlerParams: List<string> = extractHandlerParamNames(handler);
    const handlerValues: List<any> = mapHandlerParamsToValues(handlerParams, request, instance, key);
    const handlerTyped: List<any> = castHandlerValuesToTypes(handlerValues, instance, key);
    return handler.call(instance, ...handlerTyped.toArray());
};
