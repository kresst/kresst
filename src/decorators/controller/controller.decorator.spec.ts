import { expect } from "chai";
import { suite, test } from "mocha-typescript";
import { Next, Request, Response } from "restify";
import { Controller } from "../../";
import { METADATA_KEYS } from "../../domain/Constants";
import { ControllerMetadata } from "../../domain/decorators/ControllerMetadata";

@suite("Unit Test: @Controller")
class ControllerDecoratorSpec {
    @test
    "should add Controller metadata to a class when decorated with @Controller"(): void {
        const path = "foo";
        const middleware = [(req: Request, res: Response, next: Next) => {}];

        @Controller(path, ...middleware)
        class TestController {}

        const controllerMetadata: ControllerMetadata<any> = Reflect.getMetadata(METADATA_KEYS.CONTROLLER, TestController);

        expect(controllerMetadata.middleware).to.deep.equal(middleware);
        expect(controllerMetadata.path).to.deep.equal(`/${path}`);
        expect(controllerMetadata.constructor).to.deep.equal(TestController);
    }
}
