import { expect } from "chai";
import { suite, test } from "mocha-typescript";
import Optional from "typescript-optional";
import { KresstError } from "../../domain/errors/KresstError";
import { BusinessRuleMode } from "../../domain/rules/BusinessRuleMode";
import { FakeClassMock } from "../../mocks/domain/FakeClass.mock";
import { ObjectPropertyRequiredRule } from "./object-property-required.rule";

describe("Unit Test: ObjectPropertyRequiredBusinessRule", () => {
    const rule: ObjectPropertyRequiredRule<FakeClassMock> = new ObjectPropertyRequiredRule<FakeClassMock>(BusinessRuleMode.ANY, "property");

    @suite(`Common operations`)
    class ObjectPropertyRequiredRuleSpecCommon {
        @test
        "should be applicable"(): void {
            const mock = new FakeClassMock();

            expect(rule.isApplicable(mock)).to.be.true;
        }
    }

    [BusinessRuleMode.CREATE, BusinessRuleMode.UPDATE].forEach((mode: BusinessRuleMode) => {
        @suite(`Specific operations: [${mode}]`)
        class ObjectPropertyRequiredRuleSpecSpecific {
            @test
            "should be executable"(): void {
                expect(rule.isExecutable(mode)).to.be.true;
            }

            @test
            "should work successfully if property is defined accordingly"(): void {
                const mock = new FakeClassMock(new FakeClassMock());

                expect(rule.check(mode, mock).isPresent).to.be.false;
            }

            @test
            "should fail if property is not set"(): void {
                const mock = new FakeClassMock();

                expect(rule.check(mode, mock).isPresent).to.be.true;
            }

            @test
            "should fail if property is null"(): void {
                const mock = new FakeClassMock(null);

                expect(rule.check(mode, mock).isPresent).to.be.true;
            }

            @test
            "should fail if property is undefined"(): void {
                const mock = new FakeClassMock(undefined);

                expect(rule.check(mode, mock).isPresent).to.be.true;
            }

            @test
            "failed check properly indicates failing property"(): void {
                const mock = new FakeClassMock(null);
                const optionalError: Optional<KresstError<FakeClassMock>> = rule.check(mode, mock);

                expect(optionalError.isPresent).to.be.true;

                const error: KresstError<FakeClassMock> = optionalError.get();
                expect(error.data.get("PROPERTY")).to.deep.equal("property");
            }
        }
    });
});
