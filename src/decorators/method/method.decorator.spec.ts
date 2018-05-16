import { expect } from "chai";
import { suite, test } from "mocha-typescript";
import { Next, Request, Response } from "restify";
import { METADATA_KEYS } from "../../domain/Constants";
import { ControllerMethodMetadata, ControllerMethodMetadataList } from "../../domain/ControllerMethodMetadata";
import { Method } from "../../index";

@suite("Unit Test: @Method")
class MethodDecoratorSpec {
    @test("should add Method metadata to a class when decorated with @Method")
    public addMethodMetadataToClassWhenDecoratedWithMethod(): void {
        const path = "foo";
        const method = "get";
        const middleware = [(req: Request, res: Response, next: Next) => {}];

        class TestController {
            @Method(method, path, ...middleware)
            public myRequestHandler(): void {}

            @Method("foo", "bar")
            public test2(): void {}

            @Method("bar", "foo")
            public test3(): void {}
        }

        const methodMetadata: ControllerMethodMetadataList = Reflect.getMetadata(METADATA_KEYS.CONTROLLER_METHOD, TestController);

        expect(methodMetadata.length).to.deep.equal(3);

        const metadata: ControllerMethodMetadata = methodMetadata[0];

        expect(metadata.middleware).to.deep.equal(middleware);
        expect(metadata.options).to.deep.equal(path);
        expect(metadata.target.constructor).to.deep.equal(TestController);
        expect(metadata.key).to.deep.equal("myRequestHandler");
        expect(metadata.method).to.deep.equal(method);
    }
}
