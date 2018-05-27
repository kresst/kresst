import Optional from "typescript-optional";
import { KresstError } from "../errors/KresstError";
import { BusinessRuleMode } from "./BusinessRuleMode";
import { IBusinessRule } from "./IBusinessRule";

export abstract class BusinessRule<E> implements IBusinessRule<E> {
    private readonly mode: BusinessRuleMode;

    protected constructor(mode: BusinessRuleMode = BusinessRuleMode.ANY) {
        this.mode = mode;
    }

    public isExecutable(mode: BusinessRuleMode): boolean {
        return mode === this.mode || this.mode === BusinessRuleMode.ANY;
    }

    // tslint:disable-next-line:no-unused-variable
    public isApplicable(entity: E): boolean {
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
