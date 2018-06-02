import { List } from "immutable";
import { BusinessRuleControl, BusinessRuleMode, IBusinessRule } from "../../../../src/domain/rules";
import { StringPropertyRequiredRule } from "../../../../src/rules/required";
import { FakeClassMock } from "../domain/FakeClass.mock";

export class FakeServiceMock extends BusinessRuleControl<FakeClassMock> {
    constructor() {
        super();
    }

    public get checkForUpdateMock(): Function {
        return this.checkForUpdate;
    }

    public get checkForCreationMock(): Function {
        return this.checkForCreation;
    }

    public create(fakeClassMock: FakeClassMock): FakeClassMock {
        this.checkForCreation(fakeClassMock);
        return fakeClassMock;
    }

    public update(fakeClassMock: FakeClassMock): FakeClassMock {
        this.checkForUpdate(fakeClassMock);
        return fakeClassMock;
    }

    public getBusinessRulesMock(): List<IBusinessRule<any>> {
        return this.businessRules;
    }

    protected getBusinessRules(): List<IBusinessRule<FakeClassMock>> {
        return List([new StringPropertyRequiredRule<FakeClassMock>(BusinessRuleMode.ANY, "property")]);
    }
}
