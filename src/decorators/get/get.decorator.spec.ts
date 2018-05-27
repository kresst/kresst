import { expect } from "chai";
import { suite, test } from "mocha-typescript";
import { Next, Request, Response } from "restify";
import { Controller } from "../../";
import { METADATA_KEYS } from "../../domain/Constants";
import { ControllerMethodMetadata, ControllerMethodMetadataList } from "../../domain/decorators/ControllerMethodMetadata";
import { GET } from "./get.decorator";

@suite("Unit Test: @GET")
class GetDecoratorSpec {
    @test("should add GET metadata to a class when decorated with @GET")
    public addMetadata(): void {
        const middleware = [(req: Request, res: Response, next: Next) => {}];

        @Controller()
        class TestController {
            @GET("/handler", ...middleware)
            public myRequestHandler(): void {}

            @GET()
            public parameterLess(): void {}
        }

        const metadataList: ControllerMethodMetadataList = Reflect.getMetadata(METADATA_KEYS.CONTROLLER_METHOD, TestController);

        expect(metadataList.length).to.deep.equal(2);

        const handlerMetadata: ControllerMethodMetadata = metadataList[0];

        expect(handlerMetadata.middleware).to.deep.equal(middleware);
        expect(handlerMetadata.options).to.deep.equal("/handler");
        expect(handlerMetadata.target.constructor).to.deep.equal(TestController);
        expect(handlerMetadata.key).to.deep.equal("myRequestHandler");
        expect(handlerMetadata.method).to.deep.equal("get");

        const parameterLessMetadata: ControllerMethodMetadata = metadataList[1];

        expect(parameterLessMetadata.middleware).to.deep.equal([]);
        expect(parameterLessMetadata.options).to.deep.equal("/");
        expect(parameterLessMetadata.target.constructor).to.deep.equal(TestController);
        expect(parameterLessMetadata.key).to.deep.equal("parameterLess");
        expect(parameterLessMetadata.method).to.deep.equal("get");
    }
}
