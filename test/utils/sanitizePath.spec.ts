import { expect } from "chai";
import { suite, test } from "mocha-typescript";
import { sanitizePath } from "../../src/utils";

@suite("Unit Test: [UTILS] sanitizePath")
class SanitizePathSpec {
    @test
    "should supply a sanitized path for a null input"(): void {
        expect(sanitizePath(<any>null)).to.deep.equal("");
    }

    @test
    "should supply a sanitized path for an undefined input"(): void {
        expect(sanitizePath(undefined)).to.deep.equal("");
    }

    @test
    "should supply a sanitized path for an empty input"(): void {
        expect(sanitizePath()).to.deep.equal("");
    }

    @test
    "should supply a sanitized path for a string input"(): void {
        expect(sanitizePath("///this//////is///a///////te///st//")).to.deep.equal("/this/is/a/te/st");
    }
}
