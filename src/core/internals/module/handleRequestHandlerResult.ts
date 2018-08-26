import { isNil } from "lodash";
import { Next, Response } from "restify";
import { DefinedHttpError } from "restify-errors";
import { EMPTY, Observable } from "rxjs";
import { catchError } from "rxjs/operators";

export const handleRequestHandlerResult = (result$: Observable<any>, response: Response, next: Next): void => {
    result$
        .pipe(
            catchError((error: DefinedHttpError) => {
                next(error);
                return EMPTY;
            })
        )
        .subscribe((value: any): void => {
            if (!isNil(value)) {
                response.json(value);
            } else {
                response.send();
            }

            return next();
        });
};
