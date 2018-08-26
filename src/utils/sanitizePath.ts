import { dedupeSlashes } from "@kresst/utils";
import { camelCase, isString } from "lodash";

export const sanitizePath = (path: string = "", defaultPath?: string): string => {
    let _path = "";

    if (isString(path)) {
        _path = path.trim();
    } else if (isString(defaultPath)) {
        _path = camelCase(defaultPath);
    }

    return dedupeSlashes(`/${_path}`);
};
