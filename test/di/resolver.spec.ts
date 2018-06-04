import { expect } from "chai";
import { suite, test } from "mocha-typescript";
import { ERROR_MESSAGES, Injectable, resolveConstructor } from "../../src/index";

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
    @test
    "should inject proper data for @Inject()-less-type parameters"(): void {
        const instance: InjectLessParamClass = resolveConstructor<InjectLessParamClass>(InjectLessParamClass);

        expect(instance.primary).to.be.instanceof(Primary);
        expect(instance.secondary).to.be.instanceof(Secondary);
    }

    @test
    "should throw when incorrectly configured"(): void {
        const missingDecorator = () => {
            const instance: MissingInjectableParamClass = resolveConstructor<MissingInjectableParamClass>(MissingInjectableParamClass);
        };

        expect(missingDecorator).to.throw(ERROR_MESSAGES.MISSING_INJECTABLE_DECORATOR("MissingInjectableParamClass"));
    }
}
