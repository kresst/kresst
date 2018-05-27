import { expect } from "chai";
import { suite, test } from "mocha-typescript";
import { FakeClassMock } from "../../mocks/domain/FakeClass.mock";
import { EmptyServiceMock } from "../../mocks/services/EmptyService.mock";
import { FakeServiceMock } from "../../mocks/services/FakeService.mock";
import { StringPropertyRequiredRule } from "../../rules/required/string-property-required.rule";
import { IBusinessRule } from "./IBusinessRule";

@suite("Unit Test: BusinessRuleControlSpec")
class BusinessRuleControlSpec {
    @test
    "should initialize with no business rules if not defined"(): void {
        const emptyServiceMock = new EmptyServiceMock();

        const rules: Array<IBusinessRule<any>> = emptyServiceMock.getBusinessRulesMock();

        expect(rules).to.be.instanceof(Array);
        expect(rules).to.be.empty;
    }

    @test
    "should initialize with business rules defined by subclass"(): void {
        const fakeServiceMock = new FakeServiceMock();

        const rules: Array<IBusinessRule<FakeClassMock>> = fakeServiceMock.getBusinessRulesMock();

        expect(rules).to.be.instanceof(Array);
        expect(rules).to.have.lengthOf(1);
        expect(rules[0]).to.be.instanceof(StringPropertyRequiredRule);
    }
}
