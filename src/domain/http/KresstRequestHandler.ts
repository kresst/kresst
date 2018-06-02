import { RawRequestHandler } from "./RawRequestHandler";
import { SimpleRequestHandler } from "./SimpleRequestHandler";

export type KresstRequestHandler = RawRequestHandler | SimpleRequestHandler;
