import { KresstError } from "@kresst/core";
import { HttpStatus } from "@kresst/http";
import { BusinessRule, BusinessRuleMode } from "@kresst/rules";
import { isEmpty, isNil } from "lodash";
import Optional from "typescript-optional";

export class StringPropertyRequiredRule<T> extends BusinessRule<T> {
    private readonly property: string;

    constructor(mode: BusinessRuleMode, property: string) {
        super(mode);

        this.property = property;
    }

    public isApplicable(_object: T): boolean {
        return true;
    }

    public buildError(): KresstError<T> {
        return new KresstError<T>(HttpStatus.PRECONDITION_FAILED, "common.errors.property.string.required", "property required").set(
            "PROPERTY",
            this.property
        );
    }

    protected checkForCreation(object: T): Optional<KresstError<T>> {
        const value: string = (<any>object)[this.property];

        if (isNil(value) || isEmpty(value)) {
            return Optional.ofNonNull(this.buildError());
        }

        return Optional.empty();
    }

    protected checkForUpdate(object: T): Optional<KresstError<T>> {
        return this.checkForCreation(object);
    }
}
