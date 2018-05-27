import { expect } from "chai";
import { suite, test } from "mocha-typescript";
import { METADATA_KEYS } from "../../domain/Constants";
import { IMetadata } from "../../domain/decorators/Metadata";
import { Inject } from "./inject.decorator";

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

@suite("Unit Test: @Inject as Parameters")
class InjectParametersDecoratorSpec {
    @test("should generate metadata for named-type parameters")
    public namedType(): void {
        const paramsMetadata = Reflect.getMetadata(METADATA_KEYS.TAGGED, NamedParamClass);
        expect(paramsMetadata).to.be.an("object");

        // Assert metadata for first argument
        expect(paramsMetadata["0"]).to.be.instanceof(Array);
        const m1: IMetadata = paramsMetadata["0"][0];
        expect(m1.key).to.deep.equal(METADATA_KEYS.INJECT_TAG);
        expect(m1.value).to.deep.equal("Primary");
        expect(paramsMetadata["0"][1]).to.eq(undefined);

        // Assert metadata for second argument
        expect(paramsMetadata["1"]).to.be.instanceof(Array);
        const m2: IMetadata = paramsMetadata["1"][0];
        expect(m2.key).to.deep.equal(METADATA_KEYS.INJECT_TAG);
        expect(m2.value).to.deep.equal("Secondary");
        expect(paramsMetadata["1"][1]).to.eq(undefined);

        // No more metadata should be available
        expect(paramsMetadata["2"]).to.eq(undefined);
    }

    @test("should generate metadata for class-type parameters")
    public classType(): void {
        const paramsMetadata = Reflect.getMetadata(METADATA_KEYS.TAGGED, ClassParamClass);
        expect(paramsMetadata).to.be.an("object");

        // Assert metadata for first argument
        expect(paramsMetadata["0"]).to.be.instanceof(Array);
        const m1: IMetadata = paramsMetadata["0"][0];
        expect(m1.key).to.deep.equal(METADATA_KEYS.INJECT_TAG);
        expect(m1.value).to.deep.equal(Primary);
        expect(paramsMetadata["0"][1]).to.eq(undefined);

        // Assert metadata for second argument
        expect(paramsMetadata["1"]).to.be.instanceof(Array);
        const m2: IMetadata = paramsMetadata["1"][0];
        expect(m2.key).to.deep.equal(METADATA_KEYS.INJECT_TAG);
        expect(m2.value).to.deep.equal(Secondary);
        expect(paramsMetadata["1"][1]).to.eq(undefined);

        // No more metadata should be available
        expect(paramsMetadata["2"]).to.eq(undefined);
    }

    @test("should generate metadata for guessed-type parameters")
    public guessedType(): void {
        const paramsMetadata = Reflect.getMetadata(METADATA_KEYS.TAGGED, GuessParamClass);
        expect(paramsMetadata).to.be.an("object");

        // Assert metadata for first argument
        expect(paramsMetadata["0"]).to.be.instanceof(Array);
        const m1: IMetadata = paramsMetadata["0"][0];
        expect(m1.key).to.deep.equal(METADATA_KEYS.INJECT_TAG);
        expect(m1.value).to.deep.equal(Primary);
        expect(paramsMetadata["0"][1]).to.eq(undefined);

        // Assert metadata for second argument
        expect(paramsMetadata["1"]).to.be.instanceof(Array);
        const m2: IMetadata = paramsMetadata["1"][0];
        expect(m2.key).to.deep.equal(METADATA_KEYS.INJECT_TAG);
        expect(m2.value).to.deep.equal(Secondary);
        expect(paramsMetadata["1"][1]).to.eq(undefined);

        // No more metadata should be available
        expect(paramsMetadata["2"]).to.eq(undefined);
    }
}
