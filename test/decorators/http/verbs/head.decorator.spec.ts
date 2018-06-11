import { expect } from "chai";
import { suite, test } from "mocha-typescript";
import { Next, Request, Response } from "restify";
import { HEAD, METADATA_KEYS, Resource, ResourceMethodMetadata, ResourceMethodMetadataList } from "../../../../src/index";

@suite("[DECORATOR] @HEAD")
class HeadDecoratorSpec {
    @test
    "should add HEAD metadata to a class when decorated with @HEAD"(): void {
        const middleware = [(req: Request, res: Response, next: Next) => {}];

        @Resource()
        class TestResource {
            @HEAD("", ...middleware)
            public myRequestHandler(): void {}

            @HEAD("bar")
            public test2(): void {}
        }

        const metadataList: ResourceMethodMetadataList = Reflect.getMetadata(METADATA_KEYS.RESOURCE_METHOD, TestResource);

        expect(metadataList.size).to.deep.equal(2);

        const metadata: ResourceMethodMetadata = metadataList.get(0);

        expect(metadata.middleware.toArray()).to.deep.equal(middleware);
        expect(metadata.options).to.deep.equal("");
        expect(metadata.target.constructor).to.deep.equal(TestResource);
        expect(metadata.key).to.deep.equal("myRequestHandler");
        expect(metadata.method).to.deep.equal("head");
    }
}
