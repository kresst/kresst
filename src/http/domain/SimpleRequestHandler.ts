import { KresstRequestResult } from "@kresst/http";

export type SimpleRequestHandler = (...args: Array<any>) => KresstRequestResult;
