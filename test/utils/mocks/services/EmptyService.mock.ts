import { List } from "immutable";
import { BusinessRuleControl, IBusinessRule } from "../../../../src/domain/rules";

export class EmptyServiceMock extends BusinessRuleControl<any> {
    constructor() {
        super();
    }

    public getBusinessRulesMock(): List<IBusinessRule<any>> {
        return this.businessRules;
    }
}
