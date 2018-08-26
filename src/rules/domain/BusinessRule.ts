import { KresstError } from "@kresst/core";
import { BusinessRuleMode, IBusinessRule } from "@kresst/rules";
import Optional from "typescript-optional";

export abstract class BusinessRule<E> implements IBusinessRule<E> {
    private readonly mode: BusinessRuleMode;

    protected constructor(mode: BusinessRuleMode = BusinessRuleMode.ANY) {
        this.mode = mode;
    }

    public isExecutable(mode: BusinessRuleMode): boolean {
        return mode === this.mode || this.mode === BusinessRuleMode.ANY;
    }

    public isApplicable(__entity: E): boolean {
        return true;
    }

    public check(mode: BusinessRuleMode, entity: E): Optional<KresstError<any>> {
        if (mode === BusinessRuleMode.CREATE) {
            return this.checkForCreation(entity);
        }

        if (mode === BusinessRuleMode.UPDATE) {
            return this.checkForUpdate(entity);
        }

        return Optional.empty();
    }

    protected abstract checkForUpdate(entity: E): Optional<KresstError<any>>;

    protected abstract checkForCreation(entity: E): Optional<KresstError<any>>;
}
