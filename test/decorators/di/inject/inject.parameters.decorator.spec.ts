import { expect } from "chai";
import { Map, List } from "immutable";
import { suite, test } from "mocha-typescript";
import { METADATA_KEYS } from "../../../../src/constants";
import { IMetadata, MetadataList } from "../../../../src/core";
import { Inject } from "../../../../src/di";

interface Primary {}

interface Secondary {}

class Primary implements Primary {}

class Secondary implements Secondary {}

class NamedParamClass {
    private readonly _primary: Primary;
    private readonly _secondary: Secondary;

    constructor(@Inject("Primary") primary: Primary, @Inject("Secondary") secondary: Secondary) {
        this._primary = primary;
        this._secondary = secondary;
    }

    public debug() {
        return {
            primary: this._primary,
            secondary: this._secondary
        };
    }
}

class ClassParamClass {
    private readonly _primary: Primary;
    private readonly _secondary: Secondary;

    constructor(@Inject(Primary) primary: Primary, @Inject(Secondary) secondary: Secondary) {
        this._primary = primary;
        this._secondary = secondary;
    }

    public debug() {
        return {
            primary: this._primary,
            secondary: this._secondary
        };
    }
}

class GuessParamClass {
    private readonly _primary: Primary;
    private readonly _secondary: Secondary;

    constructor(@Inject() primary: Primary, @Inject() secondary: Secondary) {
        this._primary = primary;
        this._secondary = secondary;
    }

    public debug() {
        return {
            primary: this._primary,
            secondary: this._secondary
        };
    }
}

@suite("[DECORATOR] @Inject as Parameters")
class InjectParametersDecoratorSpec {
    @test
    "should generate metadata for named-type parameters"(): void {
        const paramsMetadata: Map<string, MetadataList<any>> = Reflect.getMetadata(METADATA_KEYS.TAGGED, NamedParamClass);
        expect(paramsMetadata).to.be.instanceof(Map);

        // Assert metadata for first argument
        expect(paramsMetadata.get("0")).to.be.instanceof(List);
        const m1: IMetadata<any> = paramsMetadata.get("0").get(0);
        expect(m1.key).to.deep.equal(METADATA_KEYS.INJECT_TAG);
        expect(m1.value).to.deep.equal("Primary");
        expect(paramsMetadata.get("0").get(1)).to.eq(undefined);

        // Assert metadata for second argument
        expect(paramsMetadata.get("1")).to.be.instanceof(List);
        const m2: IMetadata<any> = paramsMetadata.get("1").get(0);
        expect(m2.key).to.deep.equal(METADATA_KEYS.INJECT_TAG);
        expect(m2.value).to.deep.equal("Secondary");
        expect(paramsMetadata.get("1").get(1)).to.eq(undefined);

        // No more metadata should be available
        expect(paramsMetadata.get("2")).to.eq(undefined);
    }

    @test
    "should generate metadata for class-type parameters"(): void {
        const paramsMetadata: Map<string, MetadataList<any>> = Reflect.getMetadata(METADATA_KEYS.TAGGED, ClassParamClass);
        expect(paramsMetadata).to.be.instanceof(Map);

        // Assert metadata for first argument
        expect(paramsMetadata.get("0")).to.be.instanceof(List);
        const m1: IMetadata<any> = paramsMetadata.get("0").get(0);
        expect(m1.key).to.deep.equal(METADATA_KEYS.INJECT_TAG);
        expect(m1.value).to.deep.equal(Primary);
        expect(paramsMetadata.get("0").get(1)).to.eq(undefined);

        // Assert metadata for second argument
        expect(paramsMetadata.get("1")).to.be.instanceof(List);
        const m2: IMetadata<any> = paramsMetadata.get("1").get(0);
        expect(m2.key).to.deep.equal(METADATA_KEYS.INJECT_TAG);
        expect(m2.value).to.deep.equal(Secondary);
        expect(paramsMetadata.get("1").get(1)).to.eq(undefined);

        // No more metadata should be available
        expect(paramsMetadata.get("2")).to.eq(undefined);
    }

    @test
    "should generate metadata for guessed-type parameters"(): void {
        const paramsMetadata: Map<string, MetadataList<any>> = Reflect.getMetadata(METADATA_KEYS.TAGGED, GuessParamClass);
        expect(paramsMetadata).to.be.instanceof(Map);

        // Assert metadata for first argument
        expect(paramsMetadata.get("0")).to.be.instanceof(List);
        const m1: IMetadata<any> = paramsMetadata.get("0").get(0);
        expect(m1.key).to.deep.equal(METADATA_KEYS.INJECT_TAG);
        expect(m1.value).to.deep.equal(Primary);
        expect(paramsMetadata.get("0").get(1)).to.eq(undefined);

        // Assert metadata for second argument
        expect(paramsMetadata.get("1")).to.be.instanceof(List);
        const m2: IMetadata<any> = paramsMetadata.get("1").get(0);
        expect(m2.key).to.deep.equal(METADATA_KEYS.INJECT_TAG);
        expect(m2.value).to.deep.equal(Secondary);
        expect(paramsMetadata.get("1").get(1)).to.eq(undefined);

        // No more metadata should be available
        expect(paramsMetadata.get("2")).to.eq(undefined);
    }
}
