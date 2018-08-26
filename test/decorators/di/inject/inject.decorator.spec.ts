import { expect } from "chai";
import { suite, test } from "mocha-typescript";
import "reflect-metadata";
import { ERROR_MESSAGES, METADATA_KEYS } from "../../../../src/constants";
import { Inject } from "../../../../src/di";
import { decorate } from "../../../utils/test/decorate";

declare function __decorate(
    decorators: Array<ClassDecorator>,
    target: Object,
    propertyKey: string | symbol,
    descriptor?: TypedPropertyDescriptor<any>
): void;

const __param = (paramIndex: number, decorator: ParameterDecorator): any => {
    return (target: Object, propertyKey: string | symbol): void => decorator(target, propertyKey, paramIndex);
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

@suite("[DECORATOR] @Inject")
class InjectDecoratorSpec {
    @test
    "should throw when applied multiple times"(): void {
        const useDecoratorMoreThanOnce = () => {
            decorate(Inject(Primary), InvalidDecoratorUsageClass);
            decorate(Inject("Primary"), InvalidDecoratorUsageClass);
        };

        const msg = `${ERROR_MESSAGES.DUPLICATED_METADATA} ${Symbol.keyFor(METADATA_KEYS.INJECT_TAG)}`;
        expect(useDecoratorMoreThanOnce).to.throw(msg);
    }

    @test
    "should throw when not applied to a constructor"(): void {
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
