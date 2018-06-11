import { expect } from "chai";
import { suite, test } from "mocha-typescript";
import Optional from "typescript-optional";
import { KresstError } from "../../../src/domain/errors";
import { BusinessRuleMode } from "../../../src/domain/rules";
import { StringFormatRule } from "../../../src/rules/format";
import { FakeClassMock } from "../../utils/mocks/domain/FakeClass.mock";

describe("[UNIT] StringFormatBusinessRule", () => {
    const rule: StringFormatRule<FakeClassMock> = new StringFormatRule<FakeClassMock>(BusinessRuleMode.ANY, "property", "[a-zA-Z0-9]{5}");

    @suite(`Common operations`)
    class StringFormatRuleSpecCommon {
        @test
        "should be applicable if property is set"(): void {
            const mock = new FakeClassMock("OK");

            expect(rule.isApplicable(mock)).to.be.true;
        }

        @test
        "should not be applicable if property is unset"(): void {
            const mock = new FakeClassMock();

            expect(rule.isApplicable(mock)).to.be.false;
        }
    }

    [BusinessRuleMode.CREATE, BusinessRuleMode.UPDATE].forEach((mode: BusinessRuleMode) => {
        @suite(`Specific operations: [${mode}]`)
        class StringFormatRuleSpecSpecific {
            @test
            "should be executable"(): void {
                expect(rule.isExecutable(mode)).to.be.true;
            }

            @test
            "should work successfully if property is not defined"(): void {
                const mock = new FakeClassMock();

                expect(rule.check(mode, mock).isPresent).to.be.false;
            }

            @test
            "should work successfully if property is defined accordingly"(): void {
                const mock = new FakeClassMock("Hello");

                expect(rule.check(mode, mock).isPresent).to.be.false;
            }

            @test
            "should fail if property is wrongly defined"(): void {
                const mock = new FakeClassMock("What a job");

                expect(rule.check(mode, mock).isPresent).to.be.true;
            }

            @test
            "failed check properly indicates failing property"(): void {
                const mock = new FakeClassMock("What a job");
                const optionalError: Optional<KresstError<FakeClassMock>> = rule.check(mode, mock);

                expect(optionalError.isPresent).to.be.true;

                const error: KresstError<FakeClassMock> = optionalError.get();
                expect(error.data.get("PROPERTY")).to.deep.equal("property");
            }
        }
    });
});
