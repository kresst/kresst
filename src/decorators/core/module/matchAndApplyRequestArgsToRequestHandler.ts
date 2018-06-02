import { List } from "immutable";
import { Request } from "restify";
import { KresstRequestResult, SimpleRequestHandler } from "../../../domain";
import { extractHandlerParamNames } from "./extractHandlerParamNames";
import { mapHandlerParamsToValues } from "./mapHandlerParamsToValues";

export const matchAndApplyRequestArgsToRequestHandler = (
    handler: SimpleRequestHandler,
    instance: any,
    request: Request
): KresstRequestResult => {
    const handlerParams: List<string> = extractHandlerParamNames(handler);
    return handler.call(instance, ...mapHandlerParamsToValues(handlerParams, request).toArray());
};
