import { expect } from "chai";
import { isArray } from "lodash";
import { suite, test } from "mocha-typescript";
import "reflect-metadata";
import { ERROR_MESSAGES, METADATA_KEYS } from "../../domain/Constants";
import { Injectable } from "./injectable.decorator";

@suite("Unit Test: @Injectable")
class InjectableDecoratorSpec {
    private static decorate(decorators: any, target: Function): Function {
        return Reflect.decorate(isArray(decorators) ? decorators : [decorators], target);
    }

    @test("should generate metadata if declared injections")
    public generateMetadataIfDeclaredInjections(): void {
        class Primary {}

        interface Secondary {}

        @Injectable()
        class Test {
            constructor(private readonly _primary: Primary, private readonly _secondary: Secondary) {}

            public debug() {
                return {
                    primary: this._primary,
                    secondary: this._secondary
                };
            }
        }

        const metadata = Reflect.getMetadata(METADATA_KEYS.PARAM_TYPES, Test);
        expect(metadata).to.be.instanceof(Array);
        expect(metadata[0]).to.deep.equal(Primary);
        expect(metadata[1]).to.deep.equal(Object);
        expect(metadata[2]).to.eq(undefined);
    }

    @test("should throw when applied multiple times")
    public throwWhenAppliedMultipleTimes(): void {
        @Injectable()
        class Test {}

        const useDecoratorMoreThanOnce = () => {
            InjectableDecoratorSpec.decorate(Injectable(), Test);
            InjectableDecoratorSpec.decorate(Injectable(), Test);
        };

        expect(useDecoratorMoreThanOnce).to.throw(ERROR_MESSAGES.DUPLICATED_INJECTABLE_DECORATOR);
    }
}
