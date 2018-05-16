export interface Newable {
    new (...args: any[]): {};
}

export type NewableList = Array<Newable>;
