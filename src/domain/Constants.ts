const METADATA_KEYS = {
    TAGGED: Symbol.for("kresst:tagged"),
    NAMED_TAG: Symbol.for("kresst:named"),
    INJECT_TAG: Symbol.for("kresst:inject"),
    CONTROLLER: Symbol.for("kresst:controller"),
    PARAM_TYPES: Symbol.for("kresst:paramTypes"),
    TAGGED_PROP: Symbol.for("kresst:taggedProps"),
    MODULE_CONFIG: Symbol.for("kresst:moduleConfig"),
    MODULE_PROVIDERS: Symbol.for("kresst:moduleProviders"),
    CONTROLLER_METHOD: Symbol.for("kresst:controllerMethod"),
    DESIGN_TYPE: "design:type",
    DESIGN_PARAM_TYPES: "design:paramtypes"
};

const ERROR_MESSAGES = {
    DUPLICATED_PROVIDER: "Provider was used more than once in a module:",
    DUPLICATED_METADATA: "Metadata key was used more than once in a parameter:",
    METHOD_MUST_BE_A_STRING: (key: string, method: any) => `Method for route ${key} should be a string, got: ${method}`,
    UNRECOGNIZED_SERVER_METHOD: (key: string, method: string) => `Unrecognized method used for route ${key}: ${method}`,
    INVALID_DECORATOR_OPERATION: `@Inject() decorator must be applied to the parameters of a class constructor or a class property.`,
    MISSING_INJECTABLE_DECORATOR: (parameter: string) => `Cannot inject ${parameter}. Did you forget the @Injectable() decorator?`,
    DUPLICATED_INJECTABLE_DECORATOR: "Cannot apply @Injectable decorator multiple times."
};

export { METADATA_KEYS, ERROR_MESSAGES };
