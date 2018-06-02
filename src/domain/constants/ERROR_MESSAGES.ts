export const ERROR_MESSAGES = {
    DUPLICATED_PROVIDER: "Provider was used more than once in a module:",
    DUPLICATED_METADATA: "Metadata key was used more than once in a parameter:",
    METHOD_MUST_BE_A_STRING: (key: string, method: any) => `Method for route ${key} should be a string, got: ${method}`,
    UNRECOGNIZED_SERVER_METHOD: (key: string, method: string) => `Unrecognized method used for route ${key}: ${method}`,
    INVALID_DECORATOR_OPERATION: `@Inject() decorator must be applied to the parameters of a class constructor or a class property.`,
    MISSING_INJECTABLE_DECORATOR: (parameter: string) => `Cannot inject ${parameter}. Did you forget the @Injectable() decorator?`,
    DUPLICATED_INJECTABLE_DECORATOR: "Cannot apply @Injectable decorator multiple times."
};
