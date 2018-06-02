import { List } from "immutable";

export interface Newable {
    new (...args: Array<any>): {};
}

export type NewableList = List<Newable>;
export type NewableArray = Array<Newable>;
export type NewableLike = Newable | NewableList | NewableArray;
