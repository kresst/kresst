import { expect } from "chai";
import { suite, test } from "mocha-typescript";
import { Next, Request, Response } from "restify";
import { GET, METADATA_KEYS, Resource, ResourceMethodMetadata, ResourceMethodMetadataList } from "../../../../src/index";

@suite("[DECORATOR] @GET")
class GetDecoratorSpec {
    @test
    "should add GET metadata to a class when decorated with @GET"(): void {
        const middleware = [(req: Request, res: Response, next: Next) => {}];

        @Resource()
        class TestResource {
            @GET("/handler", ...middleware)
            public myRequestHandler(): void {}

            @GET()
            public parameterLess(): void {}
        }

        const metadataList: ResourceMethodMetadataList = Reflect.getMetadata(METADATA_KEYS.RESOURCE_METHOD, TestResource);

        expect(metadataList.size).to.deep.equal(2);

        const handlerMetadata: ResourceMethodMetadata = metadataList.get(0);

        expect(handlerMetadata.middleware.toArray()).to.deep.equal(middleware);
        expect(handlerMetadata.options).to.deep.equal("/handler");
        expect(handlerMetadata.target.constructor).to.deep.equal(TestResource);
        expect(handlerMetadata.key).to.deep.equal("myRequestHandler");
        expect(handlerMetadata.method).to.deep.equal("get");

        const parameterLessMetadata: ResourceMethodMetadata = metadataList.get(1);

        expect(parameterLessMetadata.middleware.toArray()).to.deep.equal([]);
        expect(parameterLessMetadata.options).to.deep.equal("/");
        expect(parameterLessMetadata.target.constructor).to.deep.equal(TestResource);
        expect(parameterLessMetadata.key).to.deep.equal("parameterLess");
        expect(parameterLessMetadata.method).to.deep.equal("get");
    }
}
