import "reflect-metadata";
import { Module } from "./decorators/module/module.decorator";
import { Resource } from "./decorators/resource/resource.decorator";
import { Method } from "./decorators/method/method.decorator";
import { GET } from "./decorators/get/get.decorator";
import { POST } from "./decorators/post/post.decorator";
import { PUT } from "./decorators/put/put.decorator";
import { DELETE } from "./decorators/delete/delete.decorator";
import { PATCH } from "./decorators/patch/patch.decorator";
import { HEAD } from "./decorators/head/head.decorator";
import { OPTIONS } from "./decorators/options/options.decorator";
import { Injectable } from "./decorators/injectable/injectable.decorator";
import { Inject } from "./decorators/inject/inject.decorator";

export {
    // DECORATORS
    Module,
    Resource,
    Method,
    GET,
    POST,
    PUT,
    DELETE,
    PATCH,
    HEAD,
    OPTIONS,
    Inject,
    Injectable
};
