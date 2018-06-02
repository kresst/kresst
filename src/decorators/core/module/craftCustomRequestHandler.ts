import { Next, Request, RequestHandler, Response } from "restify";
import { from, isObservable, of } from "rxjs/index";
import { KresstRequestResult, SimpleRequestHandler } from "../../../domain";
import { handleRequestHandlerResult } from "./handleRequestHandlerResult";
import { matchAndApplyRequestArgsToRequestHandler } from "./matchAndApplyRequestArgsToRequestHandler";

export const craftCustomRequestHandler = (handler: SimpleRequestHandler, instance: any): RequestHandler => {
    return (request: Request, response: Response, next: Next): void => {
        try {
            const result: KresstRequestResult = matchAndApplyRequestArgsToRequestHandler(handler, instance, request);

            if (isObservable(result)) {
                return handleRequestHandlerResult(result, response, next);
            }

            if (<Promise<any>>result instanceof Promise) {
                return handleRequestHandlerResult(from(result), response, next);
            }

            return handleRequestHandlerResult(of(result), response, next);
        } catch (exception) {
            return handleRequestHandlerResult(of(exception), response, next);
        }
    };
};
