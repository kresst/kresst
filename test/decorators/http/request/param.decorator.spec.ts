import { expect } from "chai";
import { List } from "immutable";
import { suite, test } from "mocha-typescript";
import { METADATA_KEYS, Param, ParamLocation } from "../../../../src/index";

@suite("Unit Test: @Param")
class ParamDecoratorSpec {
    @test
    "should add Param location metadata to a method's property when decorated with @Param"(): void {
        class TestResource {
            public myRequestHandler(@Param(ParamLocation.BODY) name: string): void {}
        }

        const paramLocations: List<ParamLocation> = Reflect.getMetadata(METADATA_KEYS.PARAM, TestResource.prototype, "myRequestHandler");

        expect(paramLocations.get(0)).to.deep.equal(ParamLocation.BODY);
    }
}
