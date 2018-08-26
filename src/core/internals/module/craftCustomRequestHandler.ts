import { KresstRequestResult, SimpleRequestHandler } from "@kresst/http";
import { Next, Request, RequestHandler, Response } from "restify";
import { from, isObservable, of } from "rxjs";
import { handleRequestHandlerResult } from "./handleRequestHandlerResult";
import { matchAndApplyRequestArgsToHandler } from "./matchAndApplyRequestArgsToHandler";

export const craftCustomRequestHandler = (handler: SimpleRequestHandler, instance: Object, key: string): RequestHandler => {
    return (request: Request, response: Response, next: Next): void => {
        try {
            const result: KresstRequestResult = matchAndApplyRequestArgsToHandler(request, handler, instance, key);

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
