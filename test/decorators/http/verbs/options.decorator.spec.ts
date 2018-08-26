import { expect } from "chai";
import { suite, test } from "mocha-typescript";
import { Next, Request, Response } from "restify";
import { METADATA_KEYS } from "../../../../src/constants";
import { Resource, ResourceMethodMetadata, ResourceMethodMetadataList } from "../../../../src/core";
import { OPTIONS } from "../../../../src/http";

@suite("[DECORATOR] @OPTIONS")
class OptionsDecoratorSpec {
    @test
    "should add OPTIONS metadata to a class when decorated with @OPTIONS"(): void {
        const middleware = [(req: Request, res: Response, next: Next) => {}];

        @Resource()
        class TestResource {
            @OPTIONS("", ...middleware)
            public myRequestHandler(): void {}

            @OPTIONS("bar")
            public test2(): void {}
        }

        const metadataList: ResourceMethodMetadataList = Reflect.getMetadata(METADATA_KEYS.RESOURCE_METHOD, TestResource);

        expect(metadataList.size).to.deep.equal(2);

        const metadata: ResourceMethodMetadata = metadataList.get(0);

        expect(metadata.middleware.toArray()).to.deep.equal(middleware);
        expect(metadata.options).to.deep.equal("");
        expect(metadata.target.constructor).to.deep.equal(TestResource);
        expect(metadata.key).to.deep.equal("myRequestHandler");
        expect(metadata.method).to.deep.equal("opts");
    }
}
