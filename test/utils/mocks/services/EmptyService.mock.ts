import { List } from "immutable";
import { BusinessRuleControl, IBusinessRule } from "../../../../src/rules";

export class EmptyServiceMock extends BusinessRuleControl<any> {
    constructor() {
        super();
    }

    public getBusinessRulesMock(): List<IBusinessRule<any>> {
        return this.businessRules;
    }
}
