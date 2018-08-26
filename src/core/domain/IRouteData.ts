import { Server } from "restify";
import { ResourceMetadata, ResourceMethodMetadata } from "../index";

export interface IRouteData {
    server: Server;
    instance: Object;
    metadata: ResourceMetadata<any>;
    methodMetadata: ResourceMethodMetadata;
}
