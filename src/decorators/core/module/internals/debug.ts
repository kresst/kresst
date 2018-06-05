import { ModuleConfig } from "../../../../domain/index";
import { isBoolean, isNil } from "lodash";

export const debug = (moduleConfig: ModuleConfig, message: any): void => {
    if (!isBoolean(moduleConfig.debug) || !moduleConfig.debug) {
        return;
    }

    if (isNil(moduleConfig.logger)) {
        return console.log(message);
    }

    moduleConfig.logger.debug(message);
};
