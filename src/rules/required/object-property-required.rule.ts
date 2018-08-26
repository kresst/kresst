import { KresstError } from "@kresst/core";
import { HttpStatus } from "@kresst/http";
import { BusinessRule, BusinessRuleMode } from "@kresst/rules";
import { isNil } from "lodash";
import Optional from "typescript-optional";

export class ObjectPropertyRequiredRule<T> extends BusinessRule<T> {
    private readonly property: string;

    constructor(mode: BusinessRuleMode, property: string) {
        super(mode);

        this.property = property;
    }

    public isApplicable(__object: T): boolean {
        return true;
    }

    public buildError(): KresstError<T> {
        return new KresstError<T>(HttpStatus.PRECONDITION_FAILED, "common.errors.property.object.required", "property required").set(
            "PROPERTY",
            this.property
        );
    }

    protected checkForCreation(object: T): Optional<KresstError<T>> {
        if (isNil((<any>object)[this.property])) {
            return Optional.ofNonNull(this.buildError());
        }

        return Optional.empty();
    }

    protected checkForUpdate(object: T): Optional<KresstError<T>> {
        return this.checkForCreation(object);
    }
}
