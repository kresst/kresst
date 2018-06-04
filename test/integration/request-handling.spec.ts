import { suite, test } from "mocha-typescript";
import { Next, Request, Response, ServerOptions } from "restify";
import { BadRequestError, InternalServerError } from "restify-errors";
import { Observable, of } from "rxjs";
import { throwError } from "rxjs/internal/observable/throwError";
import { delay } from "rxjs/operators";
import * as request from "supertest";
import { VError } from "verror";
import { DELETE, GET, HEAD, Method, PATCH, POST, PUT, Raw, Resource } from "../../src/index";
import { testServerFactory } from "../utils/test/testServerFactory.utils";

@suite("Integration Tests: Routing & Request Handling")
class RequestHandlingSpec {
    @test
    "should work for async resource methods"(done: MochaDone): void {
        @Resource()
        class TestResource {
            @Raw
            @GET()
            public getTest(req: Request, res: Response, next: Next): void {
                setTimeout(() => {
                    res.send(200, "GET");
                    return next();
                }, 100);
            }
        }

        request(testServerFactory(TestResource))
            .get("/")
            .set("Accept", "text/plain")
            .expect(200, "GET", done);
    }

    @test
    "should work for async resource methods that fails"(done: MochaDone): void {
        @Resource()
        class TestResource {
            @Raw
            @GET()
            public getTest(req: Request, res: Response, next: Next): void {
                setTimeout(() => next(new InternalServerError()), 100);
            }
        }

        request(testServerFactory(TestResource))
            .get("/")
            .expect(500, done);
    }

    @test
    "should work for each shortcut decorator"(done: MochaDone): void {
        @Resource()
        class TestResource {
            @Raw
            @GET()
            public getTest(req: Request, res: Response, next: Next): void {
                res.send(200, "GET");
                return next();
            }

            @Raw
            @POST()
            public postTest(req: Request, res: Response, next: Next): void {
                res.send(200, "POST");
                return next();
            }

            @Raw
            @PUT()
            public putTest(req: Request, res: Response, next: Next): void {
                res.send(200, "PUT");
                return next();
            }

            @Raw
            @PATCH()
            public patchTest(req: Request, res: Response, next: Next): void {
                res.send(200, "PATCH");
                return next();
            }

            @Raw
            @HEAD()
            public headTest(req: Request, res: Response, next: Next): void {
                res.send(200, "HEAD");
                return next();
            }

            @Raw
            @DELETE()
            public deleteTest(req: Request, res: Response, next: Next): void {
                res.send(200, "DELETE");
                return next();
            }
        }

        const agent = request(testServerFactory(TestResource));

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

    @test
    "should work for more obscure HTTP methods using the @Method decorator"(done: MochaDone): void {
        @Resource()
        class TestResource {
            @Raw
            @Method("opts", "/")
            public getTest(req: Request, res: Response, next: Next): void {
                res.send(200, "OPTIONS");
                return next();
            }
        }

        request(testServerFactory(TestResource))
            .options("/")
            .set("Accept", "text/plain")
            .expect(200, "OPTIONS", done);
    }

    @test
    "should not prevent sending response to client"(done: MochaDone): void {
        const result = { hello: "world" };

        @Resource("/")
        class TestResource {
            @Raw
            @GET("/")
            public getTest(req: Request, res: Response, next: Next): void {
                res.json(result);
                return next();
            }
        }

        request(testServerFactory(TestResource))
            .get("/")
            .expect(200, JSON.stringify(result), done);
    }

    @test
    "should use simple returned values as response"(done: MochaDone): void {
        const result = { hello: "world" };

        @Resource()
        class TestResource {
            @GET("/")
            public getTest(): { hello: string } {
                return result;
            }
        }

        request(testServerFactory(TestResource))
            .get("/")
            .expect(200, JSON.stringify(result), done);
    }

    @test
    "should catch simple thrown exception and send proper response"(done: MochaDone): void {
        const message = "FAIL";

        @Resource()
        class TestResource {
            @GET("/")
            public getTest(): { hello: string } {
                throw new BadRequestError(message);
            }
        }

        request(testServerFactory(TestResource))
            .get("/")
            .expect(400, JSON.stringify({ code: "BadRequest", message }), done);
    }

    @test
    "should use Promise returned values as response"(done: MochaDone): void {
        const result = { hello: "world" };

        @Resource()
        class TestResource {
            @GET("/")
            public getTest(): Promise<{ hello: string }> {
                return new Promise((resolve: (data: any) => void) => {
                    setTimeout(() => resolve(result), 500 * Math.random());
                });
            }
        }

        request(testServerFactory(TestResource))
            .get("/")
            .expect(200, JSON.stringify(result), done);
    }

    @test
    "should catch Promise rejection and send proper error"(done: MochaDone): void {
        const message = "FAIL";

        @Resource()
        class TestResource {
            @GET("/")
            public getTest(): Promise<{ hello: string }> {
                return new Promise((resolve: (data: any) => void, reject: (error: Error) => void) => {
                    setTimeout(() => reject(new BadRequestError(message)), 500 * Math.random());
                });
            }
        }

        request(testServerFactory(TestResource))
            .get("/")
            .expect(400, JSON.stringify({ code: "BadRequest", message }), done);
    }

    @test
    "should use Observable returned values as response"(done: MochaDone): void {
        const result = { hello: "world" };

        @Resource()
        class TestResource {
            @GET("/")
            public getTest(): Observable<{ hello: string }> {
                return of(result).pipe(delay(500 * Math.random()));
            }
        }

        request(testServerFactory(TestResource))
            .get("/")
            .expect(200, JSON.stringify(result), done);
    }

    @test
    "should catch Observable failure and send proper error"(done: MochaDone): void {
        const message = "FAIL";

        @Resource()
        class TestResource {
            @GET("/")
            public getTest(): Observable<{ hello: string }> {
                return throwError(new BadRequestError(message));
            }
        }

        request(testServerFactory(TestResource))
            .get("/")
            .expect(400, JSON.stringify({ code: "BadRequest", message }), done);
    }

    @test
    "should properly hydrate request handler params"(done: MochaDone): void {
        @Resource()
        class TestResource {
            @GET("/:x")
            public getTest(x: string, y: string): any {
                return { [x]: y };
            }
        }

        request(testServerFactory(TestResource))
            .get("/hello?y=world")
            .expect(200, JSON.stringify({ hello: "world" }), done);
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

        @Resource("/")
        class TestResource {
            @Raw
            @GET("/")
            public getTest(req: Request, res: Response, next: Next): void {
                res.json(result);
                return next();
            }
        }

        request(testServerFactory(TestResource, serverOptions))
            .get("/")
            .expect(customHeaderName, customHeaderValue)
            .expect(200, done);
    }

    @test
    "should allow server options with basePath"(done: MochaDone): void {
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

        @Resource("/")
        class TestResource {
            @Raw
            @GET("/")
            public getTest(req: Request, res: Response, next: Next): void {
                res.json(result);
                return next();
            }
        }

        request(
            testServerFactory(TestResource, serverOptions, {
                basePath: "/v1"
            })
        )
            .get("/v1")
            .expect(customHeaderName, customHeaderValue)
            .expect(200, done);
    }
}
