import { BusinessRuleControl } from "../../domain/rules/BusinessRuleControl";
import { BusinessRuleMode } from "../../domain/rules/BusinessRuleMode";
import { IBusinessRule } from "../../domain/rules/IBusinessRule";
import { StringPropertyRequiredRule } from "../../rules/required/string-property-required.rule";
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

    public getBusinessRulesMock(): Array<IBusinessRule<any>> {
        return this.businessRules;
    }

    protected getBusinessRules(): Array<IBusinessRule<FakeClassMock>> {
        return [new StringPropertyRequiredRule<FakeClassMock>(BusinessRuleMode.ANY, "property")];
    }
}
