import type { SortKey } from "./sort-games.ts";

export const SORT_OPTIONS = [
  { key: "quality", label: "کیفیت (ترکیبی)" },
  { key: "score", label: "امتیاز" },
  { key: "runCount", label: "تعداد اجرا" },
  { key: "seenCount", label: "تعداد بازدید" },
  { key: "like", label: "تعداد پسند" },
] as const satisfies readonly { key: SortKey; label: string }[];

export type SortOptionKey = (typeof SORT_OPTIONS)[number]["key"];

export function isSortOptionKey(value: string): value is SortOptionKey {
  return SORT_OPTIONS.some((option) => option.key === value);
}
