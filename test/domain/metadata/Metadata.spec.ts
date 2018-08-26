import { expect } from "chai";
import { suite, test } from "mocha-typescript";
import { METADATA_KEYS } from "../../../src/constants/index";
import { Metadata } from "../../../src/core/domain/metadata/index";

@suite("[UNIT] BusinessRuleControlSpec")
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
