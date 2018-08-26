import { KresstError } from "@kresst/core";
import { BusinessRuleHelper, BusinessRuleMode, IBusinessRule } from "@kresst/rules";
import { List } from "immutable";
import { isArray, isFunction, isNil } from "lodash";
import Optional from "typescript-optional";
import { VError } from "verror";

export class BusinessRulesBagForItems<E, I> implements IBusinessRule<E> {
    private readonly itemsAccessor: Function;
    private readonly businessRules: List<IBusinessRule<I>>;

    constructor(itemsAccessor: Function, ...businessRules: Array<IBusinessRule<I>>) {
        if (!isFunction(itemsAccessor)) {
            const error = new TypeError(`itemsAccessor is not a function: ${itemsAccessor}`);
            throw new VError(error, "BusinessRulesBagForItems creation failed");
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

    public check(mode: BusinessRuleMode, entity: E): Optional<KresstError<any>> {
        const items: Array<I> = this.itemsAccessor.apply(this.itemsAccessor, entity);

        if (isNil(items)) {
            return Optional.empty();
        }

        for (const item of items) {
            const checkResult: Optional<KresstError<any>> = this.checkItem(mode, item);

            if (checkResult.isPresent) {
                return checkResult;
            }
        }

        return Optional.empty();
    }

    private checkItem(mode: BusinessRuleMode, item: I): Optional<KresstError<any>> {
        return BusinessRuleHelper.check(mode, item, this.businessRules);
    }
}
