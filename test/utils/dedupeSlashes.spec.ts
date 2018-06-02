import { expect } from "chai";
import { suite, test } from "mocha-typescript";
import { dedupeSlashes } from "../../src/utils";

@suite("Unit Test: [UTILS] dedupeSlashes")
class DedupeSlashesSpec {
    @test
    "should dedupe slashes of string input"(): void {
        expect(dedupeSlashes("/this//is/a//test//")).to.deep.equal("/this/is/a/test");
    }

    @test
    "should not modify string with no slashes"(): void {
        expect(dedupeSlashes("It works!")).to.deep.equal("It works!");
    }

    @test
    "should dedupe slashes no matter how many"(): void {
        expect(dedupeSlashes("///this//////is///a///////te///st//")).to.deep.equal("/this/is/a/te/st");
    }
}
