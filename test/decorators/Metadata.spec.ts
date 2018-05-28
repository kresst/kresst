import { expect } from "chai";
import { suite, test } from "mocha-typescript";
import { METADATA_KEYS } from "../../src/domain/Constants";
import { Metadata } from "../../src/domain/decorators/Metadata";
import { IBusinessRule } from "../../src/domain/rules/IBusinessRule";
import { StringPropertyRequiredRule } from "../../src/rules/required/string-property-required.rule";
import { FakeClassMock } from "../mocks/domain/FakeClass.mock";
import { EmptyServiceMock } from "../mocks/services/EmptyService.mock";
import { FakeServiceMock } from "../mocks/services/FakeService.mock";

@suite("Unit Test: BusinessRuleControlSpec")
class MetadataSpec {
    @test
    "should properly print if named"(): void {
        const metadata = new Metadata(METADATA_KEYS.NAMED_TAG, 42);

        expect(metadata.toString()).to.deep.equal("Named: 42");
    }

    @test
    "should properly print if not named"(): void {
        const metadata = new Metadata("42", 42);

        expect(metadata.toString()).to.deep.equal("Tagged: { key: 42, value: 42 }");
    }
}
