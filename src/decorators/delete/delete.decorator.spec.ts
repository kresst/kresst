import { expect } from "chai";
import { suite, test } from "mocha-typescript";
import { Next, Request, Response } from "restify";
import { Controller } from "../../";
import { METADATA_KEYS } from "../../domain/Constants";
import { ControllerMethodMetadata, ControllerMethodMetadataList } from "../../domain/ControllerMethodMetadata";
import { DELETE } from "./delete.decorator";

@suite("Unit Test: @DELETE")
class DeleteDecoratorSpec {
    @test("should add DELETE metadata to a class when decorated with @DELETE")
    public addMetadata(): void {
        const middleware = [(req: Request, res: Response, next: Next) => {}];

        @Controller()
        class TestController {
            @DELETE("", ...middleware)
            public myRequestHandler(): void {}

            @DELETE("bar")
            public test2(): void {}
        }

        const metadataList: ControllerMethodMetadataList = Reflect.getMetadata(METADATA_KEYS.CONTROLLER_METHOD, TestController);

        expect(metadataList.length).to.deep.equal(2);

        const metadata: ControllerMethodMetadata = metadataList[0];

        expect(metadata.middleware).to.deep.equal(middleware);
        expect(metadata.options).to.deep.equal("");
        expect(metadata.target.constructor).to.deep.equal(TestController);
        expect(metadata.key).to.deep.equal("myRequestHandler");
        expect(metadata.method).to.deep.equal("del");
    }
}
