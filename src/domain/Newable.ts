export interface Newable {
    new (...args: Array<any>): {};
}

export type NewableList = Array<Newable>;
