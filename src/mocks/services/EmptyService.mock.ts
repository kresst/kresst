import { BusinessRuleControl } from "../../domain/rules/BusinessRuleControl";
import { IBusinessRule } from "../../domain/rules/IBusinessRule";

export class EmptyServiceMock extends BusinessRuleControl<any> {
    constructor() {
        super();
    }

    public getBusinessRulesMock(): Array<IBusinessRule<any>> {
        return this.businessRules;
    }
}
