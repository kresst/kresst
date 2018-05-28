import { expect } from "chai";
import { isArray } from "lodash";
import { suite, test } from "mocha-typescript";
import "reflect-metadata";
import { Inject } from "../../../src";
import { ERROR_MESSAGES, METADATA_KEYS } from "../../../src/domain/Constants";

declare function __decorate(decorators: ClassDecorator[], target: any, key?: any, desc?: any): void;

const __param = (paramIndex: number, decorator: ParameterDecorator): any => {
    return (target: any, key: string) => {
        decorator(target, key, paramIndex);
    };
};

interface Primary {}

interface Secondary {}

class Primary implements Primary {}

class Secondary implements Secondary {}

class InvalidDecoratorUsageClass {
    private readonly _primary: Primary;
    private readonly _secondary: Secondary;

    public constructor(primary: Primary, secondary: Secondary) {
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

@suite("Unit Test: @Inject")
class InjectDecoratorSpec {
    private static decorate(decorators: any, target: Function): Function {
        return Reflect.decorate(isArray(decorators) ? decorators : [decorators], target);
    }

    @test("should throw when applied multiple times")
    public throwWhenAppliedMultipleTimes(): void {
        const useDecoratorMoreThanOnce = () => {
            InjectDecoratorSpec.decorate(Inject(Primary), InvalidDecoratorUsageClass);
            InjectDecoratorSpec.decorate(Inject("Primary"), InvalidDecoratorUsageClass);
        };

        const msg = `${ERROR_MESSAGES.DUPLICATED_METADATA} ${Symbol.keyFor(METADATA_KEYS.INJECT_TAG)}`;
        expect(useDecoratorMoreThanOnce).to.throw(msg);
    }

    @test("should throw when not applied to a constructor")
    public throwWhenNotAppliedToConstructor(): void {
        const useDecoratorOnMethodThatIsNotAConstructor = () => {
            __decorate(
                [__param(0, Inject("Primary"))],
                InvalidDecoratorUsageClass.prototype,
                "test",
                Object.getOwnPropertyDescriptor(InvalidDecoratorUsageClass.prototype, "test")
            );
        };

        expect(useDecoratorOnMethodThatIsNotAConstructor).to.throw(ERROR_MESSAGES.INVALID_DECORATOR_OPERATION);
    }
}
