import { expect } from "chai";
import { List } from "immutable";
import { suite, test } from "mocha-typescript";
import { METADATA_KEYS, Param, ParamLocation } from "../../../../src/index";

@suite("[DECORATOR] @Param")
class ParamDecoratorSpec {
    @test
    "should add Param location metadata to a method's property when decorated with @Param"(): void {
        class TestResource {
            public myRequestHandler(@Param(ParamLocation.BODY) name: string): void {}
        }

        const paramLocations: List<ParamLocation> = Reflect.getMetadata(METADATA_KEYS.PARAM, TestResource.prototype, "myRequestHandler");

        expect(paramLocations.size).to.deep.equal(1);
        expect(paramLocations.get(0)).to.deep.equal(ParamLocation.BODY);
    }

    @test
    "should allow multiple parameters to be decorated by @Param"(): void {
        class TestResource {
            public myRequestHandler(@Param(ParamLocation.BODY) name: string, @Param(ParamLocation.HEADER) surname: string): void {}
        }

        const paramLocations: List<ParamLocation> = Reflect.getMetadata(METADATA_KEYS.PARAM, TestResource.prototype, "myRequestHandler");

        expect(paramLocations.size).to.deep.equal(2);
        expect(paramLocations.get(0)).to.deep.equal(ParamLocation.BODY);
        expect(paramLocations.get(1)).to.deep.equal(ParamLocation.HEADER);
    }
}
