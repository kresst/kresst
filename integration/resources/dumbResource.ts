import { Next, Request, Response } from "restify";
import Optional from "typescript-optional";
import { GET, Param, ParamLocation, POST, Raw, Resource } from "../../src";
import { DumbService } from "../services/dumb.service";

@Resource("dumb")
export class DumbResource {
    private _hello: number = 0;

    constructor(private readonly dumbService: DumbService) {}

    @GET(":firstName/:lastName")
    public getName(firstName: string, lastName: Optional<string>): string {
        this.dumbService.action();

        const name = lastName.map((name: string) => ` ${name}`).orElse(" Unknown");

        return `[${this._hello++}] Hello ${firstName}${name}!`;
    }

    @Raw
    @GET("/raw/:name")
    public getRawName(request: Request, response: Response, next: Next): void {
        this.dumbService.action();
        response.send(`${request.params.name} ${this._hello++}`);
        return next();
    }

    @POST()
    public postName(@Param(ParamLocation.HEADER) name: string): string {
        this.dumbService.action();
        return `${name} ${this._hello++}`;
    }
}
