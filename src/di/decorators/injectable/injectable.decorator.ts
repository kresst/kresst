import { makeInjectable } from "./makeInjectable";

/*
* @Injectable Decorator
*
* Flags a class as injectable into any other module's class.
* */
export const Injectable = (): ((constructor: any) => any) => {
    return (constructor: any): any => makeInjectable(constructor);
};
