import { expect } from "chai";
import { List } from "immutable";
import { suite, test } from "mocha-typescript";
import Optional from "typescript-optional";
import { createInstance, METADATA_KEYS } from "../../../../src";
import { castHandlerValuesToTypes } from "../../../../src/decorators/core/module/internals/castHandlerValuesToTypes";

@suite("[CORE] castHandlerValuesToTypes")
class CastHandlerValuesToTypesSpec {
    @test
    "should correctly cast value to Optional"(): void {
        const instanceKey = "toOptional";
        class TestResource {
            public [instanceKey](string: Optional<number>): void {}
        }

        const instance = createInstance(TestResource);
        Reflect.defineMetadata(METADATA_KEYS.DESIGN_PARAM_TYPES, [Optional], instance, instanceKey);

        const values: List<Optional<any>> = castHandlerValuesToTypes(List(["42"]), instance, instanceKey);

        expect(values.size).to.deep.equal(1);
        expect(values.get(0)).to.be.instanceOf(Optional);
        expect(values.get(0).get()).to.deep.equal("42");
    }

    @test
    "should correctly cast value to Number"(): void {
        const instanceKey = "toNumber";
        class TestResource {
            public [instanceKey](string: number): void {}
        }

        const instance = createInstance(TestResource);
        Reflect.defineMetadata(METADATA_KEYS.DESIGN_PARAM_TYPES, [Number], instance, instanceKey);

        const values: List<number> = castHandlerValuesToTypes(List(["42"]), instance, instanceKey);

        expect(values.size).to.deep.equal(1);
        expect(values.get(0)).to.be.a("number");
    }

    @test
    "should correctly cast value to String"(): void {
        const instanceKey = "toString";
        class TestResource {
            public [instanceKey](number: string): void {}
        }

        const instance = createInstance(TestResource);
        Reflect.defineMetadata(METADATA_KEYS.DESIGN_PARAM_TYPES, [String], instance, instanceKey);

        const values: List<string> = castHandlerValuesToTypes(List([42]), instance, instanceKey);

        expect(values.size).to.deep.equal(1);
        expect(values.get(0)).to.be.a("string");
    }

    @test
    "should correctly cast value to Boolean"(): void {
        const instanceKey = "toBoolean";
        class TestResource {
            public [instanceKey](string: boolean): void {}
        }

        const instance = createInstance(TestResource);
        Reflect.defineMetadata(METADATA_KEYS.DESIGN_PARAM_TYPES, [Boolean], instance, instanceKey);

        const values: List<boolean> = castHandlerValuesToTypes(List(["true"]), instance, instanceKey);

        expect(values.size).to.deep.equal(1);
        expect(values.get(0)).to.be.a("boolean");
    }

    @test
    "should correctly cast value to Array"(): void {
        const instanceKey = "toArray";
        class TestResource {
            public [instanceKey](bees: Array<any>): void {}
        }

        const instance = createInstance(TestResource);
        Reflect.defineMetadata(METADATA_KEYS.DESIGN_PARAM_TYPES, [Array], instance, instanceKey);

        const values: List<Array<any>> = castHandlerValuesToTypes(List(["a", true, null]), instance, instanceKey);

        expect(values.size).to.deep.equal(3);
        expect(values.get(0)).to.be.an("array");
    }

    @test
    "should correctly default to property's class"(): void {
        const instanceKey = "toBee";

        class Bee {
            public name: string;
        }

        class TestResource {
            public [instanceKey](bee: Bee): void {}
        }

        const instance = createInstance(TestResource);
        Reflect.defineMetadata(METADATA_KEYS.DESIGN_PARAM_TYPES, [Bee], instance, instanceKey);

        const values: List<Bee> = castHandlerValuesToTypes(List([{ name: "fred" }]), instance, instanceKey);

        expect(values.size).to.deep.equal(1);
        expect(values.get(0)).to.be.instanceOf(Bee);
        expect((<Bee>values.get(0)).name).to.deep.equal("fred");
    }
}
