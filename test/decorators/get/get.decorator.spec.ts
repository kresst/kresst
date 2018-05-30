import { expect } from "chai";
import { suite, test } from "mocha-typescript";
import { Next, Request, Response } from "restify";
import { Resource, GET } from "../../../src";
import { METADATA_KEYS } from "../../../src/domain/Constants";
import { ResourceMethodMetadata, ResourceMethodMetadataList } from "../../../src/domain/decorators/ResourceMethodMetadata";

@suite("Unit Test: @GET")
class GetDecoratorSpec {
    @test("should add GET metadata to a class when decorated with @GET")
    public addMetadata(): void {
        const middleware = [(req: Request, res: Response, next: Next) => {}];

        @Resource()
        class TestResource {
            @GET("/handler", ...middleware)
            public myRequestHandler(): void {}

            @GET()
            public parameterLess(): void {}
        }

        const metadataList: ResourceMethodMetadataList = Reflect.getMetadata(METADATA_KEYS.RESOURCE_METHOD, TestResource);

        expect(metadataList.length).to.deep.equal(2);

        const handlerMetadata: ResourceMethodMetadata = metadataList[0];

        expect(handlerMetadata.middleware).to.deep.equal(middleware);
        expect(handlerMetadata.options).to.deep.equal("/handler");
        expect(handlerMetadata.target.constructor).to.deep.equal(TestResource);
        expect(handlerMetadata.key).to.deep.equal("myRequestHandler");
        expect(handlerMetadata.method).to.deep.equal("get");

        const parameterLessMetadata: ResourceMethodMetadata = metadataList[1];

        expect(parameterLessMetadata.middleware).to.deep.equal([]);
        expect(parameterLessMetadata.options).to.deep.equal("/");
        expect(parameterLessMetadata.target.constructor).to.deep.equal(TestResource);
        expect(parameterLessMetadata.key).to.deep.equal("parameterLess");
        expect(parameterLessMetadata.method).to.deep.equal("get");
    }
}
