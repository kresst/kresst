import { expect } from "chai";
import { suite, test } from "mocha-typescript";
import { METADATA_KEYS } from "../../../../src/constants";
import { Raw } from "../../../../src/http";

@suite("[DECORATOR] @Raw")
class RawDecoratorSpec {
    @test
    "should add RAW metadata to a method when decorated with @Raw"(): void {
        class TestResource {
            @Raw
            public myRequestHandler(): void {}
        }

        const rawSetting: boolean = Reflect.getMetadata(METADATA_KEYS.RAW, TestResource.prototype, "myRequestHandler");

        expect(rawSetting).to.deep.equal(true);
    }
}
