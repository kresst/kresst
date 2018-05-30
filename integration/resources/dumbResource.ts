import { Request, Response, Next } from "restify";
import { Resource, GET, PATCH, POST } from "../../src";
import { DumbService } from "../services/dumb.service";

@Resource("dumb")
export class DumbResource {
    private _hello: number = 0;

    constructor(private readonly dumbService: DumbService) {}

    @GET(":name")
    public getName(request: Request, response: Response, next: Next): void {
        this.dumbService.action();
        response.send(`${request.params.name} ${this._hello++}`);
        return next();
    }

    @POST(":name")
    public postName(request: Request, response: Response, next: Next): void {
        response.send(`${request.body.name} ${this._hello}`);
        return next();
    }

    @PATCH(":name")
    public patchName(request: Request, response: Response, next: Next): void {
        response.send(`${request.body.name} ${this._hello}`);
        return next();
    }
}
