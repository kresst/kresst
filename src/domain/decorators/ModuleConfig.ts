import { ResourceList } from "./Resource";
import * as bunyan from "bunyan";
import { NewableList } from "../Newable";

export interface ModuleConfig {
    debug?: boolean;
    logger?: bunyan;
    restify: string;
    basePath?: string;
    providers?: NewableList;
    resources?: ResourceList;
}
