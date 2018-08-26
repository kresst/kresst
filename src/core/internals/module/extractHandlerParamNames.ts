import { SimpleRequestHandler } from "@kresst/http";
import { List } from "immutable";
import { isNil } from "lodash";

const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm;
const ARGUMENT_NAMES = /([^\s,]+)/g;

export const extractHandlerParamNames = (handler: SimpleRequestHandler): List<string> => {
    if (isNil(handler)) {
        return List();
    }

    const functionAsString = handler.toString().replace(STRIP_COMMENTS, "");
    const result = functionAsString.slice(functionAsString.indexOf("(") + 1, functionAsString.indexOf(")")).match(ARGUMENT_NAMES);

    if (isNil(result)) {
        return List();
    }

    return List(result);
};
