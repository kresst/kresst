import { KresstError } from "@kresst/core";
import { BusinessRuleHelper, BusinessRuleMode, IBusinessRule } from "@kresst/rules";
import { List } from "immutable";
import { isArray, isFunction } from "lodash";
import Optional from "typescript-optional";
import { VError } from "verror";

export class BusinessRulesBagForItem<E, I> implements IBusinessRule<E> {
    private readonly itemsAccessor: Function;
    private readonly businessRules: List<IBusinessRule<I>>;

    constructor(itemsAccessor: Function, ...businessRules: Array<IBusinessRule<I>>) {
        if (!isFunction(itemsAccessor)) {
            const error = new TypeError(`itemsAccessor is not a function: ${itemsAccessor}`);
            throw new VError(error, "BusinessRulesBagForItem creation failed");
        }

        this.itemsAccessor = itemsAccessor;
        this.businessRules = isArray(businessRules) ? List(businessRules) : List();
    }

    public isApplicable(__object: E): boolean {
        return true;
    }

    public isExecutable(__mode: BusinessRuleMode): boolean {
        return true;
    }

    public check(mode: BusinessRuleMode, object: E): Optional<KresstError<any>> {
        return BusinessRuleHelper.check(mode, this.itemsAccessor.apply(this.itemsAccessor, object), this.businessRules);
    }
}
