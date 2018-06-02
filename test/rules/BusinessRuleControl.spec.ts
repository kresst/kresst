import { expect } from "chai";
import { List } from "immutable";
import { suite, test } from "mocha-typescript";
import { IBusinessRule } from "../../src/domain/rules";
import { StringPropertyRequiredRule } from "../../src/rules/required";
import { FakeClassMock } from "../utils/mocks/domain/FakeClass.mock";
import { EmptyServiceMock } from "../utils/mocks/services/EmptyService.mock";
import { FakeServiceMock } from "../utils/mocks/services/FakeService.mock";

@suite("Unit Test: BusinessRuleControlSpec")
class BusinessRuleControlSpec {
    @test
    "should initialize with no business rules if not defined"(): void {
        const emptyServiceMock = new EmptyServiceMock();

        const rules: List<IBusinessRule<any>> = emptyServiceMock.getBusinessRulesMock();

        expect(rules).to.be.instanceof(List);
        expect(rules.size).to.deep.equal(0);
    }

    @test
    "should initialize with business rules defined by subclass"(): void {
        const fakeServiceMock = new FakeServiceMock();

        const rules: List<IBusinessRule<FakeClassMock>> = fakeServiceMock.getBusinessRulesMock();

        expect(rules).to.be.instanceof(List);
        expect(rules.size).to.deep.equal(1);
        expect(rules.get(0)).to.be.instanceof(StringPropertyRequiredRule);
    }
}
