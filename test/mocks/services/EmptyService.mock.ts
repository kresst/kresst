import { List } from "immutable";
import { BusinessRuleControl } from "../../../src/domain/rules/BusinessRuleControl";
import { IBusinessRule } from "../../../src/domain/rules/IBusinessRule";

export class EmptyServiceMock extends BusinessRuleControl<any> {
    constructor() {
        super();
    }

    public getBusinessRulesMock(): List<IBusinessRule<any>> {
        return this.businessRules;
    }
}
