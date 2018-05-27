import { expect } from "chai";
import { suite, test } from "mocha-typescript";
import { Next, Request, Response } from "restify";
import { Controller } from "../../";
import { METADATA_KEYS } from "../../domain/Constants";
import { ControllerMethodMetadata, ControllerMethodMetadataList } from "../../domain/decorators/ControllerMethodMetadata";
import { PATCH } from "./patch.decorator";

@suite("Unit Test: @PATCH")
class PatchDecoratorSpec {
    @test("should add PATCH metadata to a class when decorated with @PATCH")
    public addMetadata(): void {
        const middleware = [(req: Request, res: Response, next: Next) => {}];

        @Controller()
        class TestController {
            @PATCH("", ...middleware)
            public myRequestHandler(): void {}

            @PATCH("bar")
            public test2(): void {}
        }

        const metadataList: ControllerMethodMetadataList = Reflect.getMetadata(METADATA_KEYS.CONTROLLER_METHOD, TestController);

        expect(metadataList.length).to.deep.equal(2);

        const metadata: ControllerMethodMetadata = metadataList[0];

        expect(metadata.middleware).to.deep.equal(middleware);
        expect(metadata.options).to.deep.equal("");
        expect(metadata.target.constructor).to.deep.equal(TestController);
        expect(metadata.key).to.deep.equal("myRequestHandler");
        expect(metadata.method).to.deep.equal("patch");
    }
}
