import { isNil } from "lodash";
import Optional from "typescript-optional";
import { KresstError } from "../../domain/errors/KresstError";
import { HttpStatus } from "../../domain/HttpStatus";
import { BusinessRule } from "../../domain/rules/BusinessRule";
import { BusinessRuleMode } from "../../domain/rules/BusinessRuleMode";

export class StringFormatRule<T> extends BusinessRule<T> {
    private readonly pattern: RegExp;
    private readonly property: string;

    constructor(mode: BusinessRuleMode, property: string, pattern: string | RegExp) {
        super(mode);

        this.pattern = new RegExp(pattern);
        this.property = property;
    }

    public isApplicable(object: T): boolean {
        return !isNil((<any>object)[this.property]);
    }

    public buildError(): KresstError<T> {
        return new KresstError<T>(HttpStatus.PRECONDITION_FAILED, "common.errors.property.string.format", "wrong format").set(
            "PROPERTY",
            this.property
        );
    }

    protected checkForCreation(object: T): Optional<KresstError<T>> {
        const property: string = (<any>object)[this.property];

        if (!isNil(property) && !this.pattern.test(property)) {
            return Optional.ofNonNull(this.buildError());
        }

        return Optional.empty();
    }

    protected checkForUpdate(object: T): Optional<KresstError<T>> {
        return this.checkForCreation(object);
    }
}
