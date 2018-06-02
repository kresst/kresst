import { expect } from "chai";
import { suite, test } from "mocha-typescript";
import "reflect-metadata";
import { ERROR_MESSAGES, Injectable, METADATA_KEYS } from "../../../src/index";
import { decorate } from "../../utils/test/decorate";

@suite("Unit Test: @Injectable")
class InjectableDecoratorSpec {
    @test
    "should generate metadata if declared injections"(): void {
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

    @test
    "should throw when applied multiple times"(): void {
        @Injectable()
        class Test {}

        const useDecoratorMoreThanOnce = () => {
            decorate(Injectable(), Test);
            decorate(Injectable(), Test);
        };

        expect(useDecoratorMoreThanOnce).to.throw(ERROR_MESSAGES.DUPLICATED_INJECTABLE_DECORATOR);
    }
}
