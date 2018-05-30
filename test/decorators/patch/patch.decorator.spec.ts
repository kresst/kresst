import { expect } from "chai";
import { suite, test } from "mocha-typescript";
import { Next, Request, Response } from "restify";
import { Resource, PATCH } from "../../../src";
import { METADATA_KEYS } from "../../../src/domain/Constants";
import { ResourceMethodMetadata, ResourceMethodMetadataList } from "../../../src/domain/decorators/ResourceMethodMetadata";

@suite("Unit Test: @PATCH")
class PatchDecoratorSpec {
    @test("should add PATCH metadata to a class when decorated with @PATCH")
    public addMetadata(): void {
        const middleware = [(req: Request, res: Response, next: Next) => {}];

        @Resource()
        class TestResource {
            @PATCH("", ...middleware)
            public myRequestHandler(): void {}

            @PATCH("bar")
            public test2(): void {}
        }

        const metadataList: ResourceMethodMetadataList = Reflect.getMetadata(METADATA_KEYS.RESOURCE_METHOD, TestResource);

        expect(metadataList.length).to.deep.equal(2);

        const metadata: ResourceMethodMetadata = metadataList[0];

        expect(metadata.middleware).to.deep.equal(middleware);
        expect(metadata.options).to.deep.equal("");
        expect(metadata.target.constructor).to.deep.equal(TestResource);
        expect(metadata.key).to.deep.equal("myRequestHandler");
        expect(metadata.method).to.deep.equal("patch");
    }
}
