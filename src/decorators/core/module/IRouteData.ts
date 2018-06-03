import { List } from "immutable";
import { Server } from "restify";
import { KresstRequestHandler, ResourceMetadata, ResourceMethodMetadata } from "../../../domain";

export interface IRouteData {
    server: Server;
    instance: any;
    metadata: ResourceMetadata<any>;
    middleware: List<KresstRequestHandler>;
    methodMetadata: ResourceMethodMetadata;
}