import { List, Map } from "immutable";
import { isFunction } from "lodash";
import { Request } from "restify";
import { METADATA_KEYS, ParamLocation } from "../../../../index";

export const mapHandlerParamsToValues = (params: List<string>, request: Request, instance: Object, key: string): List<any> => {
    const requestBody: Map<string, any> = Map(request.body);
    const requestQuery: Map<string, any> = Map(isFunction(request.query) ? null : request.query);
    const requestParams: Map<string, any> = Map(request.params);

    const paramLocations: List<ParamLocation> = List(Reflect.getMetadata(METADATA_KEYS.PARAM, instance, key));

    return params
        .map((param: string, index: number): any => {
            let value: any = null;

            switch (paramLocations.get(index)) {
                case ParamLocation.BODY:
                    value = requestBody.get(param);
                    break;

                case ParamLocation.PATH:
                    value = requestParams.get(param);
                    break;

                case ParamLocation.QUERY:
                    value = requestQuery.get(param);
                    break;

                case ParamLocation.HEADER:
                    value = request.header(param);
                    break;

                default:
                    value = requestBody.get(param) || requestQuery.get(param) || requestParams.get(param) || request.header(param);
            }

            return value;
        })
        .toList();
};
