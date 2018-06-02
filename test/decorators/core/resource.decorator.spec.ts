import { expect } from "chai";
import { suite, test } from "mocha-typescript";
import { Next, Request, Response } from "restify";
import { Resource } from "../../../src/decorators/core/index";
import { METADATA_KEYS } from "../../../src/domain/constants/index";
import { ResourceMetadata } from "../../../src/domain/decorators/index";

@suite("Unit Test: @Resource")
class ResourceDecoratorSpec {
    @test
    "should add Resource metadata to a class when decorated with @Resource"(): void {
        const path = "foo";
        const middleware = [(req: Request, res: Response, next: Next) => {}];

        @Resource(path, ...middleware)
        class TestResource {}

        const resourceMetadata: ResourceMetadata<any> = Reflect.getMetadata(METADATA_KEYS.RESOURCE, TestResource);

        expect(resourceMetadata.middleware.toArray()).to.deep.equal(middleware);
        expect(resourceMetadata.path).to.deep.equal(`/${path}`);
        expect(resourceMetadata.constructor).to.deep.equal(TestResource);
    }
}
