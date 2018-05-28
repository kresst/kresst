import { expect } from "chai";
import { suite, test } from "mocha-typescript";
import * as restify from "restify";
import { Controller, Method, Module } from "../../../src";
import { ERROR_MESSAGES } from "../../../src/domain/Constants";

@suite("Unit Test: @Module")
class ModuleDecoratorSpec {
    @test("should generate routes for controller methods")
    public generateRoutesForControllerMethods(): void {
        @Controller("root")
        class TestController {
            @Method("get", "routeOne")
            public routeOne(): void {}

            @Method("get", { options: "test", path: "routeTwo" })
            public routeTwo(): void {}

            @Method("get", { path: "routeThree" })
            public routeThree(): void {}
        }

        @Module({
            restify: "server",
            controllers: [TestController]
        })
        class Server {
            public server: restify.Server = restify.createServer();
        }

        const restifyServer = <any>new Server().server;
        const routes = restifyServer.router._registry._routes;

        expect(routes.getrootrouteone).not.to.equal(undefined);
        expect(routes.getrootrouteone.spec.path).to.equal("/root/routeOne");

        expect(routes.getrootroutetwo).not.to.equal(undefined);
        expect(routes.getrootroutetwo.spec.path).to.equal("/root/routeTwo");

        expect(routes.getrootroutethree).not.to.equal(undefined);
        expect(routes.getrootroutethree.spec.path).to.equal("/root/routeThree");
    }

    @test("should generate routes for controller methods using basePath")
    public generateRoutesForControllerMethodsUsingBasePath(): void {
        @Controller("root")
        class TestController {
            @Method("get", "routeOne")
            public routeOne(): void {}

            @Method("get", { options: "test", path: "routeTwo" })
            public routeTwo(): void {}

            @Method("get", { path: "routeThree" })
            public routeThree(): void {}
        }

        @Module({
            basePath: "v1",
            restify: "server",
            controllers: [TestController]
        })
        class Server {
            public server: restify.Server = restify.createServer();
        }

        const restifyServer = <any>new Server().server;
        const routes = restifyServer.router._registry._routes;

        expect(routes.getv1rootrouteone).not.to.equal(undefined);
        expect(routes.getv1rootrouteone.spec.path).to.equal("/v1/root/routeOne");

        expect(routes.getv1rootroutetwo).not.to.equal(undefined);
        expect(routes.getv1rootroutetwo.spec.path).to.equal("/v1/root/routeTwo");

        expect(routes.getv1rootroutethree).not.to.equal(undefined);
        expect(routes.getv1rootroutethree.spec.path).to.equal("/v1/root/routeThree");
    }

    @test("should handle routes slashes correctly for controller methods")
    public handleRoutesSlashesCorrectlyForControllerMethods(): void {
        @Controller("/root")
        class TestController {
            @Method("get", "/routeOne")
            public routeOne(): void {}

            @Method("get", { options: "test", path: "//routeTwo" })
            public routeTwo(): void {}

            @Method("get", { path: "///routeThree" })
            public routeThree(): void {}
        }

        @Module({
            basePath: "//v1",
            restify: "server",
            controllers: [TestController]
        })
        class Server {
            public server: restify.Server = restify.createServer();
        }

        const restifyServer = <any>new Server().server;
        const routes = restifyServer.router._registry._routes;

        expect(routes.getv1rootrouteone).not.to.equal(undefined);
        expect(routes.getv1rootrouteone.spec.path).to.equal("/v1/root/routeOne");

        expect(routes.getv1rootroutetwo).not.to.equal(undefined);
        expect(routes.getv1rootroutetwo.spec.path).to.equal("/v1/root/routeTwo");

        expect(routes.getv1rootroutethree).not.to.equal(undefined);
        expect(routes.getv1rootroutethree.spec.path).to.equal("/v1/root/routeThree");
    }

    @test("should throw when the desired route method is not a string")
    public throwWhenDesiredRouteMethodNotString(): void {
        const method = null;
        const route = "routeOne";

        const desiredMethodNotString = () => {
            @Controller()
            class TestController {
                @Method(<any>method, route)
                public routeOne(): void {}
            }

            @Module({
                restify: "server",
                controllers: [TestController]
            })
            class Server {
                public server: restify.Server = restify.createServer();
            }

            const server = new Server();
        };

        expect(desiredMethodNotString).to.throw(ERROR_MESSAGES.METHOD_MUST_BE_A_STRING(route, method));
    }

    @test("should throw when the desired route method does not exist")
    public throwWhenDesiredRouteMethodDoesNotExist(): void {
        const method = "gett";
        const route = "routeOne";

        const desiredMethodNotString = () => {
            @Controller()
            class TestController {
                @Method(method, route)
                public routeOne(): void {}
            }

            @Module({
                restify: "server",
                controllers: [TestController]
            })
            class Server {
                public server: restify.Server = restify.createServer();
            }

            const server = new Server();
        };

        expect(desiredMethodNotString).to.throw(ERROR_MESSAGES.UNRECOGNIZED_SERVER_METHOD(route, method));
    }
}
