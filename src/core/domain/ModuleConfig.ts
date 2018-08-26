import * as bunyan from "bunyan";
import { NewableArray } from "./Newable";
import { ResourceArray } from "./IResource";

export interface ModuleConfig {
    debug?: boolean;
    logger?: bunyan;
    restify: string;
    basePath?: string;
    providers?: NewableArray;
    resources?: ResourceArray;
}
