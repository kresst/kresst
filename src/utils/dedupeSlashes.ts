export const dedupeSlashes = (value: string) => {
    return value.replace(/(\/)\/+/g, "$1").replace(/\/$/, "");
};
