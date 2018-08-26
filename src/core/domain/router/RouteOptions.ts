type StringOrRegex = string | RegExp;
export type RouteOptions = StringOrRegex | { path: StringOrRegex } | { options: Object; path: StringOrRegex } & Object;
