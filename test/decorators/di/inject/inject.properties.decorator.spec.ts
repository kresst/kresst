import { expect } from "chai";
import { List, Map } from "immutable";
import { suite, test } from "mocha-typescript";
import { IMetadata, Inject, METADATA_KEYS, MetadataList } from "../../../../src/index";

interface Primary {}

interface Secondary {}

class Primary implements Primary {}

class Secondary implements Secondary {}

class NamedPropClass {
    @Inject("Primary") private readonly _primary: Primary;

    @Inject("Secondary") private readonly _secondary: Secondary;

    public debug() {
        return {
            primary: this._primary,
            secondary: this._secondary
        };
    }
}

class ClassPropClass {
    @Inject(Primary) private readonly _primary: Primary;

    @Inject(Secondary) private readonly _secondary: Secondary;

    public debug() {
        return {
            primary: this._primary,
            secondary: this._secondary
        };
    }
}

class GuessPropClass {
    @Inject() private readonly _primary: Primary;

    @Inject() private readonly _secondary: Secondary;

    public debug() {
        return {
            primary: this._primary,
            secondary: this._secondary
        };
    }
}

@suite("Unit Test: @Inject as Properties")
class InjectDecoratorSpecProperties {
    @test
    "should generate metadata for named-type properties"(): void {
        const paramsMetadata: Map<string, MetadataList<any>> = Reflect.getMetadata(METADATA_KEYS.TAGGED_PROP, NamedPropClass);
        expect(paramsMetadata).to.be.instanceof(Map);

        // Assert metadata for first argument
        expect(paramsMetadata.get("_primary")).to.be.instanceof(List);
        const m1: IMetadata<any> = paramsMetadata.get("_primary").get(0);
        expect(m1.key).to.deep.equal(METADATA_KEYS.INJECT_TAG);
        expect(m1.value).to.deep.equal("Primary");
        expect(paramsMetadata.get("_primary").get(1)).to.eq(undefined);

        // Assert metadata for second argument
        expect(paramsMetadata.get("_secondary")).to.be.instanceof(List);
        const m2: IMetadata<any> = paramsMetadata.get("_secondary").get(0);
        expect(m2.key).to.deep.equal(METADATA_KEYS.INJECT_TAG);
        expect(m2.value).to.deep.equal("Secondary");
        expect(paramsMetadata.get("_secondary").get(1)).to.eq(undefined);

        // No more metadata should be available
        expect(paramsMetadata.size).to.eq(2);
    }

    @test
    "should generate metadata for class-type properties"(): void {
        const paramsMetadata: Map<string, MetadataList<any>> = Reflect.getMetadata(METADATA_KEYS.TAGGED_PROP, ClassPropClass);
        expect(paramsMetadata).to.be.instanceof(Map);

        // Assert metadata for first argument
        expect(paramsMetadata.get("_primary")).to.be.instanceof(List);
        const m1: IMetadata<any> = paramsMetadata.get("_primary").get(0);
        expect(m1.key).to.deep.equal(METADATA_KEYS.INJECT_TAG);
        expect(m1.value).to.deep.equal(Primary);
        expect(paramsMetadata.get("_primary").get(1)).to.eq(undefined);

        // Assert metadata for second argument
        expect(paramsMetadata.get("_secondary")).to.be.instanceof(List);
        const m2: IMetadata<any> = paramsMetadata.get("_secondary").get(0);
        expect(m2.key).to.deep.equal(METADATA_KEYS.INJECT_TAG);
        expect(m2.value).to.deep.equal(Secondary);
        expect(paramsMetadata.get("_secondary").get(1)).to.eq(undefined);

        // No more metadata should be available
        expect(paramsMetadata.size).to.eq(2);
    }

    @test
    "should generate metadata for guessed-type properties"(): void {
        const paramsMetadata: Map<string, MetadataList<any>> = Reflect.getMetadata(METADATA_KEYS.TAGGED_PROP, GuessPropClass);
        expect(paramsMetadata).to.be.instanceof(Map);

        // Assert metadata for first argument
        expect(paramsMetadata.get("_primary")).to.be.instanceof(List);
        const m1: IMetadata<any> = paramsMetadata.get("_primary").get(0);
        expect(m1.key).to.deep.equal(METADATA_KEYS.INJECT_TAG);
        expect(m1.value).to.deep.equal(Primary);
        expect(paramsMetadata.get("_primary").get(1)).to.eq(undefined);

        // Assert metadata for second argument
        expect(paramsMetadata.get("_secondary")).to.be.instanceof(List);
        const m2: IMetadata<any> = paramsMetadata.get("_secondary").get(0);
        expect(m2.key).to.deep.equal(METADATA_KEYS.INJECT_TAG);
        expect(m2.value).to.deep.equal(Secondary);
        expect(paramsMetadata.get("_secondary").get(1)).to.eq(undefined);

        // No more metadata should be available
        expect(paramsMetadata.size).to.eq(2);
    }
}
