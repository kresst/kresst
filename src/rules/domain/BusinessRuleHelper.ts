import { KresstError } from "@kresst/core";
import { BusinessRuleMode, IBusinessRule } from "@kresst/rules";
import { List } from "immutable";
import { isNil } from "lodash";
import Optional from "typescript-optional";
import { VError } from "verror";

export class BusinessRuleHelper {
    public static checkOne<I>(mode: BusinessRuleMode, item: I, businessRule: IBusinessRule<I>): Optional<KresstError<any>> {
        return BusinessRuleHelper.check(mode, item, List(businessRule));
    }

    public static check<I>(mode: BusinessRuleMode, item: I, businessRules: List<IBusinessRule<I>> = List()): Optional<KresstError<any>> {
        if (isNil(mode) || isNil(item) || !List.isList(businessRules)) {
            const error = new ReferenceError(
                `(mode, item, businessRules) properties must be properly defined. Got: (${mode}, ${item}, ${businessRules})`
            );
            throw new VError(error, "BusinessRuleHelper#check failed");
        }

        for (const businessRule of businessRules.toArray()) {
            if (businessRule.isExecutable(mode) && businessRule.isApplicable(item)) {
                const checkResult: Optional<KresstError<any>> = businessRule.check(mode, item);

                if (checkResult.isPresent) {
                    return checkResult;
                }
            }
        }

        return Optional.empty();
    }

    public static applyBusinessRules<I>(mode: BusinessRuleMode, item: I, businessRules: List<IBusinessRule<I>> = List()) {
        BusinessRuleHelper.check(mode, item, businessRules).ifPresent((kresstError: KresstError<I>) => {
            throw kresstError.raise();
        });
    }
}
