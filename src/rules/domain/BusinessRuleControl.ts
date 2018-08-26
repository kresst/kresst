import { BusinessRuleHelper, BusinessRuleMode, IBusinessRule } from "@kresst/rules";
import { List } from "immutable";

export abstract class BusinessRuleControl<T> {
    protected readonly businessRules: List<IBusinessRule<T>> = List();

    protected constructor() {
        this.businessRules = this.getBusinessRules();
    }

    protected checkForCreation(item: T): void {
        BusinessRuleHelper.applyBusinessRules(BusinessRuleMode.CREATE, item, this.businessRules);
    }

    protected checkForUpdate(item: T): void {
        BusinessRuleHelper.applyBusinessRules(BusinessRuleMode.UPDATE, item, this.businessRules);
    }

    protected getBusinessRules(): List<IBusinessRule<T>> {
        return List();
    }
}
