import { KresstError } from "@kresst/core";
import { BusinessRuleMode } from "@kresst/rules";
import Optional from "typescript-optional";

export interface IBusinessRule<T> {
    /**
     * Indicates if the object is concerned by the BusinessRule.
     */
    isExecutable(mode: BusinessRuleMode): boolean;

    /**
     * Indicates if the BusinessRule is applicable on the data.
     * This method assumes the object IS NOT NULL!!!
     */
    isApplicable(data: T): boolean;

    /**
     * Checks the validity of the object knowing the mode.
     * Returns an optional error
     */
    check(mode: BusinessRuleMode, entity: T): Optional<KresstError<any>>;
}
