import { expect } from "chai";
import { suite, test } from "mocha-typescript";
import { METADATA_KEYS } from "../../domain/Constants";
import { IMetadata } from "../../domain/decorators/Metadata";
import { Inject } from "./inject.decorator";

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
    @test("should generate metadata for named-type properties")
    public namedType(): void {
        const paramsMetadata = Reflect.getMetadata(METADATA_KEYS.TAGGED_PROP, NamedPropClass);
        expect(paramsMetadata).to.be.an("object");

        // Assert metadata for first argument
        expect(paramsMetadata["_primary"]).to.be.instanceof(Array);
        const m1: IMetadata = paramsMetadata["_primary"][0];
        expect(m1.key).to.deep.equal(METADATA_KEYS.INJECT_TAG);
        expect(m1.value).to.deep.equal("Primary");
        expect(paramsMetadata["_primary"][1]).to.eq(undefined);

        // Assert metadata for second argument
        expect(paramsMetadata["_secondary"]).to.be.instanceof(Array);
        const m2: IMetadata = paramsMetadata["_secondary"][0];
        expect(m2.key).to.deep.equal(METADATA_KEYS.INJECT_TAG);
        expect(m2.value).to.deep.equal("Secondary");
        expect(paramsMetadata["_secondary"][1]).to.eq(undefined);

        // No more metadata should be available
        expect(Object.keys(paramsMetadata).length).to.eq(2);
    }

    @test("should generate metadata for class-type properties")
    public classType(): void {
        const paramsMetadata = Reflect.getMetadata(METADATA_KEYS.TAGGED_PROP, ClassPropClass);
        expect(paramsMetadata).to.be.an("object");

        // Assert metadata for first argument
        expect(paramsMetadata["_primary"]).to.be.instanceof(Array);
        const m1: IMetadata = paramsMetadata["_primary"][0];
        expect(m1.key).to.deep.equal(METADATA_KEYS.INJECT_TAG);
        expect(m1.value).to.deep.equal(Primary);
        expect(paramsMetadata["_primary"][1]).to.eq(undefined);

        // Assert metadata for second argument
        expect(paramsMetadata["_secondary"]).to.be.instanceof(Array);
        const m2: IMetadata = paramsMetadata["_secondary"][0];
        expect(m2.key).to.deep.equal(METADATA_KEYS.INJECT_TAG);
        expect(m2.value).to.deep.equal(Secondary);
        expect(paramsMetadata["_secondary"][1]).to.eq(undefined);

        // No more metadata should be available
        expect(Object.keys(paramsMetadata).length).to.eq(2);
    }

    @test("should generate metadata for guessed-type properties")
    public guessedType(): void {
        const paramsMetadata = Reflect.getMetadata(METADATA_KEYS.TAGGED_PROP, GuessPropClass);
        expect(paramsMetadata).to.be.an("object");

        // Assert metadata for first argument
        expect(paramsMetadata["_primary"]).to.be.instanceof(Array);
        const m1: IMetadata = paramsMetadata["_primary"][0];
        expect(m1.key).to.deep.equal(METADATA_KEYS.INJECT_TAG);
        expect(m1.value).to.deep.equal(Primary);
        expect(paramsMetadata["_primary"][1]).to.eq(undefined);

        // Assert metadata for second argument
        expect(paramsMetadata["_secondary"]).to.be.instanceof(Array);
        const m2: IMetadata = paramsMetadata["_secondary"][0];
        expect(m2.key).to.deep.equal(METADATA_KEYS.INJECT_TAG);
        expect(m2.value).to.deep.equal(Secondary);
        expect(paramsMetadata["_secondary"][1]).to.eq(undefined);

        // No more metadata should be available
        expect(Object.keys(paramsMetadata).length).to.eq(2);
    }
}
