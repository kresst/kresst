import { expect } from "chai";
import { suite, test } from "mocha-typescript";
import { Next, Request, Response } from "restify";
import { Controller, HEAD } from "../../../src";
import { METADATA_KEYS } from "../../../src/domain/Constants";
import { ControllerMethodMetadata, ControllerMethodMetadataList } from "../../../src/domain/decorators/ControllerMethodMetadata";

@suite("Unit Test: @HEAD")
class HeadDecoratorSpec {
    @test("should add HEAD metadata to a class when decorated with @HEAD")
    public addMetadata(): void {
        const middleware = [(req: Request, res: Response, next: Next) => {}];

        @Controller()
        class TestController {
            @HEAD("", ...middleware)
            public myRequestHandler(): void {}

            @HEAD("bar")
            public test2(): void {}
        }

        const metadataList: ControllerMethodMetadataList = Reflect.getMetadata(METADATA_KEYS.CONTROLLER_METHOD, TestController);

        expect(metadataList.length).to.deep.equal(2);

        const metadata: ControllerMethodMetadata = metadataList[0];

        expect(metadata.middleware).to.deep.equal(middleware);
        expect(metadata.options).to.deep.equal("");
        expect(metadata.target.constructor).to.deep.equal(TestController);
        expect(metadata.key).to.deep.equal("myRequestHandler");
        expect(metadata.method).to.deep.equal("head");
    }
}