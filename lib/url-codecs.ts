export type UrlCodec<T> = {
  parse: (raw: string | null, fallback: T) => T;
  serialize: (value: T) => string | null;
};

export const stringCodec: UrlCodec<string> = {
  parse: (raw, fallback) => raw ?? fallback,
  serialize: (value) => (value === "" ? null : value),
};

export const stringListCodec: UrlCodec<readonly string[]> = {
  parse: (raw, fallback) =>
    raw === null ? fallback : raw.split(",").filter((item) => item !== ""),
  serialize: (value) => (value.length === 0 ? null : value.join(",")),
};

export const booleanCodec: UrlCodec<boolean> = {
  parse: (raw, fallback) => (raw === null ? fallback : raw === "1"),
  serialize: (value) => (value ? "1" : null),
};

export const numberCodec: UrlCodec<number> = {
  parse: (raw, fallback) => {
    if (raw === null || raw.trim() === "") return fallback;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : fallback;
  },
  serialize: (value) => String(value),
};
