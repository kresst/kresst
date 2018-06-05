import { isString, isNil } from "lodash";
import { VError } from "verror";
import { ERROR_MESSAGES, ResourceMethodMetadata } from "../../../../domain/index";

export const getServerMethod = (server: any, { key, method }: ResourceMethodMetadata): Function => {
    if (!isString(method)) {
        throw new VError(ERROR_MESSAGES.METHOD_MUST_BE_A_STRING(key, method));
    }

    const serverMethod = server[method.toLowerCase().trim()];
    if (isNil(serverMethod)) {
        throw new VError(ERROR_MESSAGES.UNRECOGNIZED_SERVER_METHOD(key, method));
    }

    return serverMethod;
};
