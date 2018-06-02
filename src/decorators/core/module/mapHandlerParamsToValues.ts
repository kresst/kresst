import { List, Map } from "immutable";
import { isFunction } from "lodash";
import { Request } from "restify";

// TODO: Map values according to @Param if defined
export const mapHandlerParamsToValues = (params: List<string>, request: Request): List<any> => {
    const requestBody: Map<string, any> = Map(request.body);
    const requestQuery: Map<string, any> = Map(isFunction(request.query) ? null : request.query);
    const requestParams: Map<string, any> = Map(request.params);
    const requestHeaders: Map<string, any> = Map(request.headers);

    return params
        .map((param: string): any => {
            return requestBody.get(param) || requestQuery.get(param) || requestParams.get(param) || requestHeaders.get(param);
        })
        .toList();
};
