import { Newable, NewableLike } from "../domain";

/*
* Instance Creation
*
* Creates a new instance of supplied constructor with
* given properly ordered resolved parameters.
* */
export const createInstance = <T extends Newable>(constructor: T, injections: Array<NewableLike> = []): any => {
    return new constructor(...injections);
};
