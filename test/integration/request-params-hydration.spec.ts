import { expect } from "chai";
import { isArray, isBoolean, isNumber, isObject, isString } from "lodash";
import { suite, test } from "mocha-typescript";
import * as request from "supertest";
import Optional from "typescript-optional";
import { VError } from "verror";
import { GET, Param, ParamLocation, POST, PUT, Resource } from "../../src";
import { testServerFactory } from "../utils/test/testServerFactory.utils";

describe("Integration Tests: Request Parameters Hydration", () => {
    @suite("[Core]")
    class RequestParamsHydrationCoreSpec {
        @test
        "should properly hydrate simple request handler params"(done: MochaDone): void {
            const firstName = "John";
            const lastName = "Doe";
            const result = `Hello ${firstName} ${lastName}!`;

            @Resource("/hello")
            class TestResource {
                @GET("/:first/:last")
                public getTest(first: string, last: string): string {
                    return `Hello ${first} ${last}!`;
                }
            }

            request(testServerFactory(TestResource))
                .get(`/hello/${firstName}/${lastName}`)
                .expect(200, JSON.stringify(result), done);
        }

        @test
        "should properly hydrate params to filled Optional"(done: MochaDone): void {
            const firstName = "John";
            const lastName = "Doe";
            const result = `Hello ${firstName} ${lastName}!`;

            @Resource("/hello")
            class TestResource {
                @GET("/:first/:last")
                public getTest(first: string, last: Optional<string>): string {
                    const name = last.map((name: string) => ` ${name}`).orElse(" Unknown");

                    return `Hello ${first}${name}!`;
                }
            }

            request(testServerFactory(TestResource))
                .get(`/hello/${firstName}/${lastName}`)
                .expect(200, JSON.stringify(result), done);
        }

        @test
        "should properly hydrate params to empty Optional"(done: MochaDone): void {
            const firstName = "John";
            const lastName = "Doe";
            const result = `Hello ${firstName} Unknown!`;

            @Resource("/hello")
            class TestResource {
                @GET("/:first/:other")
                public getTest(first: string, last: Optional<string>): string {
                    const name = last.map((name: string) => ` ${name}`).orElse(" Unknown");

                    return `Hello ${first}${name}!`;
                }
            }

            request(testServerFactory(TestResource))
                .get(`/hello/${firstName}/${lastName}`)
                .expect(200, JSON.stringify(result), done);
        }

        @test
        "should properly hydrate primitive-typed params"(done: MochaDone): void {
            @Resource()
            class TestResource {
                @POST()
                public getTest(a: number, b: string, c: boolean): boolean {
                    expect(isNumber(a)).to.be.true;
                    expect(isString(b)).to.be.true;
                    expect(isBoolean(c)).to.be.true;

                    return true;
                }
            }

            request(testServerFactory(TestResource))
                .post("/")
                .send({
                    a: 42,
                    b: "hello",
                    c: false
                })
                .expect(200, JSON.stringify(true), done);
        }

        @test
        "should properly hydrate evolved-typed params"(done: MochaDone): void {
            enum TestEnum {
                HELLO = "WORLD"
            }

            interface TestInterface {
                hello: string;
            }

            @Resource()
            class TestResource {
                @POST()
                public getTest(a: Array<number>, b: TestEnum, c: Object, d: TestInterface): boolean {
                    expect(isArray(a)).to.be.true;
                    expect(isString(b)).to.be.true;
                    expect(isObject(c)).to.be.true;
                    expect(isObject(d)).to.be.true;

                    return true;
                }
            }

            request(testServerFactory(TestResource))
                .post("/")
                .send({
                    a: [42],
                    b: TestEnum.HELLO,
                    c: { hello: "world" },
                    d: { hallo: "moto" }
                })
                .expect(200, JSON.stringify(true), done);
        }

        @test
        "should properly hydrate user-typed params"(done: MochaDone): void {
            class TestClass {
                public hello: string;

                constructor(hello: string) {
                    this.hello = hello;
                }
            }

            @Resource()
            class TestResource {
                @POST()
                public getTest(a: TestClass): boolean {
                    expect(a).to.be.instanceof(TestClass);
                    expect(isString(a.hello)).to.be.true;
                    expect(a.hello).to.deep.equal("world");

                    return true;
                }
            }

            request(testServerFactory(TestResource))
                .post("/")
                .send({
                    a: new TestClass("world")
                })
                .expect(200, JSON.stringify(true), done);
        }
    }

    @suite("[@Param]")
    class RequestParamsHydrationParamDecoratorSpec {
        @test
        "should properly hydrate params for default location"(done: MochaDone): void {
            const age = 42;
            const result = `${age} and counting...`;

            @Resource("/save")
            class TestResource {
                @GET("/:birth")
                public getTest(@Param() birth: number): string {
                    return `${birth} and counting...`;
                }
            }

            request(testServerFactory(TestResource))
                .get(`/save/${age}`)
                .expect(200, JSON.stringify(result), done);
        }

        @test
        "should properly hydrate params for PATH location"(done: MochaDone): void {
            const age = 42;
            const result = `${age} and counting...`;

            @Resource("/save")
            class TestResource {
                @GET("/:birth")
                public getTest(@Param(ParamLocation.PATH) birth: number): string {
                    return `${birth} and counting...`;
                }
            }

            request(testServerFactory(TestResource))
                .get(`/save/${age}`)
                .expect(200, JSON.stringify(result), done);
        }

        @test
        "should properly hydrate params for BODY location"(done: MochaDone): void {
            const age = 42;
            const result = `${age} and counting...`;

            @Resource("/save")
            class TestResource {
                @POST()
                public getTest(@Param(ParamLocation.BODY) birth: number): string {
                    return `${birth} and counting...`;
                }
            }

            request(testServerFactory(TestResource))
                .post(`/save`)
                .send({ birth: age })
                .expect(200, JSON.stringify(result), done);
        }

        @test
        "should properly hydrate params for QUERY location"(done: MochaDone): void {
            const age = 42;
            const result = `${age} and counting...`;

            @Resource("/save")
            class TestResource {
                @GET()
                public getTest(@Param(ParamLocation.QUERY) birth: number): string {
                    return `${birth} and counting...`;
                }
            }

            request(testServerFactory(TestResource))
                .get(`/save?birth=${age}`)
                .expect(200, JSON.stringify(result), done);
        }

        @test
        "should properly hydrate params for HEADER location"(done: MochaDone): void {
            const age = 42;
            const result = `${age} and counting...`;

            @Resource()
            class TestResource {
                @PUT()
                public getTest(@Param(ParamLocation.HEADER) whatABirth: number): string {
                    return `${whatABirth} and counting...`;
                }
            }

            request(testServerFactory(TestResource))
                .put("/")
                .send({})
                .set("WhatABirth", `${age}`)
                .expect(200, JSON.stringify(result), done);
        }
    }
});
