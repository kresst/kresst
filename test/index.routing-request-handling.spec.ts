import { suite, test } from "mocha-typescript";
import { Next, Request, Response, ServerOptions } from "restify";
import { InternalServerError } from "restify-errors";
import * as request from "supertest";
import { Controller, DELETE, GET, HEAD, Method, PATCH, POST, PUT } from "../src";
import { testServerFactory } from "./utils/test.utils";

@suite("Integration Tests: Routing & Request Handling")
class IndexRoutingRequestHandlingSpec {
    @test("should work for async controller methods")
    public asyncControllerMethods(done: MochaDone): void {
        @Controller()
        class TestController {
            @GET()
            public getTest(req: Request, res: Response, next: Next): void {
                setTimeout(() => {
                    res.send(200, "GET");
                    return next();
                }, 100);
            }
        }

        request(testServerFactory(TestController))
            .get("/")
            .set("Accept", "text/plain")
            .expect(200, "GET", done);
    }

    @test("should work for async controller methods that fails")
    public asyncControllerMethodsFailure(done: MochaDone): void {
        @Controller()
        class TestController {
            @GET()
            public getTest(req: Request, res: Response, next: Next): void {
                setTimeout(() => next(new InternalServerError()), 100);
            }
        }

        request(testServerFactory(TestController))
            .get("/")
            .expect(500, done);
    }

    @test("should work for each shortcut decorator")
    public eachShortcutDecorator(done: MochaDone): void {
        @Controller()
        class TestController {
            @GET()
            public getTest(req: Request, res: Response, next: Next): void {
                res.send(200, "GET");
                return next();
            }

            @POST()
            public postTest(req: Request, res: Response, next: Next): void {
                res.send(200, "POST");
                return next();
            }

            @PUT()
            public putTest(req: Request, res: Response, next: Next): void {
                res.send(200, "PUT");
                return next();
            }

            @PATCH()
            public patchTest(req: Request, res: Response, next: Next): void {
                res.send(200, "PATCH");
                return next();
            }

            @HEAD()
            public headTest(req: Request, res: Response, next: Next): void {
                res.send(200, "HEAD");
                return next();
            }

            @DELETE()
            public deleteTest(req: Request, res: Response, next: Next): void {
                res.send(200, "DELETE");
                return next();
            }
        }

        const agent = request(testServerFactory(TestController));

        const deleteFn = () => {
            agent
                .delete("/")
                .set("Accept", "text/plain")
                .expect(200, "DELETE", done);
        };

        const head = () => {
            agent
                .head("/")
                .set("Accept", "text/plain")
                .expect(200, "HEAD", deleteFn);
        };

        const patch = () => {
            agent
                .patch("/")
                .set("Accept", "text/plain")
                .expect(200, "PATCH", head);
        };

        const put = () => {
            agent
                .put("/")
                .set("Accept", "text/plain")
                .expect(200, "PUT", patch);
        };

        const post = () => {
            agent
                .post("/")
                .set("Accept", "text/plain")
                .expect(200, "POST", put);
        };

        const get = () => {
            agent
                .get("/")
                .set("Accept", "text/plain")
                .expect(200, "GET", post);
        };

        get();
    }

    @test("should work for more obscure HTTP methods using the @Method decorator")
    public obscureMethods(done: MochaDone): void {
        @Controller()
        class TestController {
            @Method("opts", "/")
            public getTest(req: Request, res: Response, next: Next): void {
                res.send(200, "OPTIONS");
                return next();
            }
        }

        request(testServerFactory(TestController))
            .options("/")
            .set("Accept", "text/plain")
            .expect(200, "OPTIONS", done);
    }

    @test("should not prevent sending response to client")
    public notPreventSendingResponseToClient(done: MochaDone): void {
        const result = { hello: "world" };

        @Controller("/")
        class TestController {
            @GET("/")
            public getTest(req: Request, res: Response, next: Next): void {
                res.json(result);
                return next();
            }
        }

        request(testServerFactory(TestController))
            .get("/")
            .expect(200, JSON.stringify(result), done);
    }

    @test.skip
    "should use returned values as response"(done: MochaDone): void {
        const result = { hello: "world" };

        @Controller("/")
        class TestController {
            @GET("/")
            public getTest(req: Request, res: Response, next: Next): any {
                return result;
            }
        }

        request(testServerFactory(TestController))
            .get("/")
            .expect(200, JSON.stringify(result), done);
    }

    @test
    "should allow server options"(done: MochaDone): void {
        const result = { hello: "world" };
        const customHeaderName = "custom-header-name";
        const customHeaderValue = "custom-header-value";
        const serverOptions: ServerOptions = {
            formatters: {
                "application/json": (req: Request, res: Response) => {
                    res.setHeader(customHeaderName, customHeaderValue);
                    return null;
                }
            }
        };

        @Controller("/")
        class TestController {
            @GET("/")
            public getTest(req: Request, res: Response, next: Next): void {
                res.json(result);
                return next();
            }
        }

        request(testServerFactory(TestController, serverOptions))
            .get("/")
            .expect(customHeaderName, customHeaderValue)
            .expect(200, done);
    }

    @test("should allow server options with basePath")
    public allowServerOptionsWithBasePath(done: MochaDone): void {
        const result = { hello: "world" };
        const customHeaderName = "custom-header-name";
        const customHeaderValue = "custom-header-value";
        const serverOptions: ServerOptions = {
            formatters: {
                "application/json": (req: Request, res: Response) => {
                    res.setHeader(customHeaderName, customHeaderValue);
                    return null;
                }
            }
        };

        @Controller("/")
        class TestController {
            @GET("/")
            public getTest(req: Request, res: Response, next: Next): void {
                res.json(result);
                return next();
            }
        }

        request(
            testServerFactory(TestController, serverOptions, {
                basePath: "/v1"
            })
        )
            .get("/v1")
            .expect(customHeaderName, customHeaderValue)
            .expect(200, done);
    }
}
