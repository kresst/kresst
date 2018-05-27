import { BusinessRuleHelper } from "./BusinessRuleHelper";
import { BusinessRuleMode } from "./BusinessRuleMode";
import { IBusinessRule } from "./IBusinessRule";

export abstract class BusinessRuleControl<T> {
    protected readonly businessRules: Array<IBusinessRule<T>> = [];

    protected constructor() {
        this.businessRules = this.getBusinessRules();
    }

    protected checkForCreation(item: T): void {
        BusinessRuleHelper.applyBusinessRules(BusinessRuleMode.CREATE, item, this.businessRules);
    }

    protected checkForUpdate(item: T): void {
        BusinessRuleHelper.applyBusinessRules(BusinessRuleMode.UPDATE, item, this.businessRules);
    }

    protected getBusinessRules(): Array<IBusinessRule<T>> {
        return [];
    }
}
