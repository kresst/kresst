import { Next, Request, Response } from "restify";
import { GET, PATCH, POST, Raw, Resource } from "../../src";
import { DumbService } from "../services/dumb.service";

@Resource("dumb")
export class DumbResource {
    private _hello: number = 0;

    constructor(private readonly dumbService: DumbService) {}

    @GET(":name")
    public getName(name: string): string {
        this.dumbService.action();
        return `${name} ${this._hello++}`;
    }

    @Raw
    @GET("/raw/:name")
    public getRawName(request: Request, response: Response, next: Next): void {
        this.dumbService.action();
        response.send(`${request.params.name} ${this._hello++}`);
        return next();
    }
}
