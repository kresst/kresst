import { expect } from "chai";
import { Map, List } from "immutable";
import { suite, test } from "mocha-typescript";
import { MetadataList } from "../../../../src/domain/metadata";
import { IMetadata, Inject, METADATA_KEYS } from "../../../../src/index";

interface Primary {}

interface Secondary {}

class Primary implements Primary {}

class Secondary implements Secondary {}

class InlineNamedParamClass {
    constructor(@Inject("Primary") private readonly _primary: Primary, @Inject("Secondary") private readonly _secondary: Secondary) {}

    public debug() {
        return {
            primary: this._primary,
            secondary: this._secondary
        };
    }
}

class InlineClassParamClass {
    constructor(@Inject(Primary) private readonly _primary: Primary, @Inject(Secondary) private readonly _secondary: Secondary) {}

    public debug() {
        return {
            primary: this._primary,
            secondary: this._secondary
        };
    }
}

class InlineGuessParamClass {
    constructor(@Inject() private readonly _primary: Primary, @Inject() private readonly _secondary: Secondary) {}

    public debug() {
        return {
            primary: this._primary,
            secondary: this._secondary
        };
    }
}

@suite("Unit Test: @Inject as Inline Parameters")
class InjectInlineParametersDecoratorSpec {
    @test
    "should generate metadata for inline named-type parameters"(): void {
        const paramsMetadata: Map<string, MetadataList<any>> = Reflect.getMetadata(METADATA_KEYS.TAGGED, InlineNamedParamClass);
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
    "should generate metadata for inline class-type parameters"(): void {
        const paramsMetadata: Map<string, MetadataList<any>> = Reflect.getMetadata(METADATA_KEYS.TAGGED, InlineClassParamClass);
        expect(paramsMetadata).to.be.an("object");

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
    "should generate metadata for inline guessed-type parameters"(): void {
        const paramsMetadata: Map<string, MetadataList<any>> = Reflect.getMetadata(METADATA_KEYS.TAGGED, InlineGuessParamClass);
        expect(paramsMetadata).to.be.an("object");

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
