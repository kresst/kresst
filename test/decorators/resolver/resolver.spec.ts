import { expect } from "chai";
import { suite, test } from "mocha-typescript";
import { Injectable } from "../../../src";
import { resolve } from "../../../src/decorators/resolver/resolver";
import { ERROR_MESSAGES } from "../../../src/domain/Constants";

interface Primary {}

interface Secondary {}

@Injectable()
class Primary implements Primary {}

@Injectable()
class Secondary implements Secondary {}

@Injectable()
class InjectLessParamClass {
    private readonly _primary: Primary;
    private readonly _secondary: Secondary;

    constructor(primary: Primary, secondary: Secondary) {
        this._primary = primary;
        this._secondary = secondary;
    }

    public get primary(): Primary {
        return this._primary;
    }

    public get secondary(): Secondary {
        return this._secondary;
    }
}

class MissingInjectableParamClass {
    private readonly _primary: Primary;
    private readonly _secondary: Secondary;

    constructor(primary: Primary, secondary: Secondary) {
        this._primary = primary;
        this._secondary = secondary;
    }

    public get primary(): Primary {
        return this._primary;
    }

    public get secondary(): Secondary {
        return this._secondary;
    }
}

@suite("Unit Test: Resolver")
class InjectParametersDecoratorSpec {
    @test("should inject proper data for @Inject()-less-type parameters")
    public injectLessType(): void {
        const instance: InjectLessParamClass = resolve(InjectLessParamClass);

        expect(instance.primary).to.be.instanceof(Primary);
        expect(instance.secondary).to.be.instanceof(Secondary);
    }

    @test("should throw when incorrectly configured")
    public throwWhenMissing(): void {
        const missingDecorator = () => {
            const instance: MissingInjectableParamClass = resolve(MissingInjectableParamClass);
        };

        expect(missingDecorator).to.throw(ERROR_MESSAGES.MISSING_INJECTABLE_DECORATOR("MissingInjectableParamClass"));
    }
}
