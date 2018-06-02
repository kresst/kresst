import { expect } from "chai";
import { Dictionary } from "lodash";
import { suite, test } from "mocha-typescript";
import "reflect-metadata";
import { Next, Request, RequestHandler, Response, Server } from "restify";
import * as sinon from "sinon";
import { SinonSpy } from "sinon";
import * as request from "supertest";
import { GET, Raw, Resource } from "../../src/index";
import { testServerFactory } from "../utils/test/testServerFactory.utils";

let spyA: SinonSpy;
let spyB: SinonSpy;
let spyC: SinonSpy;

@suite("Integration Tests: Middleware Processing")
class IndexMiddlewareProcessingSpec {
    private readonly middleware: Dictionary<RequestHandler>;

    private result: string;

    constructor() {
        this.result = "";

        this.middleware = {
            a: (req: Request, res: Response, next: Next): void => {
                this.result += "a";
                return next();
            },

            b: (req: Request, res: Response, next: Next): void => {
                this.result += "b";
                return next();
            },

            c: (req: Request, res: Response, next: Next): void => {
                this.result += "c";
                return next();
            }
        };

        spyA = sinon.spy(this.middleware, "a");
        spyB = sinon.spy(this.middleware, "b");
        spyC = sinon.spy(this.middleware, "c");
    }

    @test
    "should call method-level middleware correctly"(done: MochaDone): void {
        @Resource()
        class TestResource {
            @Raw
            @GET("/", spyA, spyB, spyC)
            public getTest(req: Request, res: Response, next: Next): void {
                res.send("GET");
                return next();
            }
        }

        request(testServerFactory(TestResource))
            .get("/")
            .expect(200, "GET", () => {
                expect(spyA.calledOnce).to.deep.equal(true);
                expect(spyB.calledOnce).to.deep.equal(true);
                expect(spyC.calledOnce).to.deep.equal(true);
                expect(this.result).to.equal("abc");
                done();
            });
    }

    @test
    "should call resource-level middleware correctly"(done: MochaDone): void {
        @Resource("/", spyA, spyB, spyC)
        class TestResource {
            @Raw
            @GET()
            public getTest(req: Request, res: Response, next: Next): void {
                res.send("GET");
                return next();
            }
        }

        request(testServerFactory(TestResource))
            .get("/")
            .expect(200, "GET", () => {
                expect(spyA.calledOnce).to.deep.equal(true);
                expect(spyB.calledOnce).to.deep.equal(true);
                expect(spyC.calledOnce).to.deep.equal(true);
                expect(this.result).to.equal("abc");
                done();
            });
    }

    @test
    "should call server-level middleware correctly"(done: MochaDone): void {
        @Resource()
        class TestResource {
            @Raw
            @GET()
            public getTest(req: Request, res: Response, next: Next): void {
                res.send("GET");
                return next();
            }
        }

        const serverConfigFn = (server: Server): void => {
            server.use(spyA);
            server.use(spyB);
            server.use(spyC);
        };

        request(testServerFactory(TestResource, undefined, undefined, serverConfigFn))
            .get("/")
            .expect(200, "GET", () => {
                expect(spyA.calledOnce).to.deep.equal(true);
                expect(spyB.calledOnce).to.deep.equal(true);
                expect(spyC.calledOnce).to.deep.equal(true);
                expect(this.result).to.equal("abc");
                done();
            });
    }

    @test
    "should call all middleware in correct order"(done: MochaDone): void {
        @Resource("/", spyB)
        class TestResource {
            @Raw
            @GET("/", spyC)
            public getTest(req: Request, res: Response, next: Next): void {
                res.send("GET");
                return next();
            }
        }

        const serverConfigFn = (server: Server): void => {
            server.use(spyA);
        };

        request(testServerFactory(TestResource, undefined, undefined, serverConfigFn))
            .get("/")
            .expect(200, "GET", () => {
                expect(spyA.calledOnce).to.deep.equal(true);
                expect(spyB.calledOnce).to.deep.equal(true);
                expect(spyC.calledOnce).to.deep.equal(true);
                expect(this.result).to.equal("abc");
                done();
            });
    }

    private before(): void {
        this.result = "";

        spyA.resetHistory();
        spyB.resetHistory();
        spyC.resetHistory();
    }
}
