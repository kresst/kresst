import { expect } from "chai";
import { suite, test } from "mocha-typescript";
import { Next, Request, Response } from "restify";
import { METADATA_KEYS, Method, ResourceMethodMetadata, ResourceMethodMetadataList } from "../../../../src/index";

@suite("Unit Test: @Method")
class MethodDecoratorSpec {
    @test
    "should add Method metadata to a class when decorated with @Method"(): void {
        const path = "foo";
        const method = "get";
        const middleware = [(req: Request, res: Response, next: Next) => {}];

        class TestResource {
            @Method(method, path, ...middleware)
            public myRequestHandler(): void {}

            @Method("foo", "bar")
            public test2(): void {}

            @Method("bar", "foo")
            public test3(): void {}
        }

        const methodMetadata: ResourceMethodMetadataList = Reflect.getMetadata(METADATA_KEYS.RESOURCE_METHOD, TestResource);

        expect(methodMetadata.size).to.deep.equal(3);

        const metadata: ResourceMethodMetadata = methodMetadata.get(0);

        expect(metadata.middleware.toArray()).to.deep.equal(middleware);
        expect(metadata.options).to.deep.equal(path);
        expect(metadata.target.constructor).to.deep.equal(TestResource);
        expect(metadata.key).to.deep.equal("myRequestHandler");
        expect(metadata.method).to.deep.equal(method);
    }
}
