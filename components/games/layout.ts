export const GRID_CLASS =
  "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
export const CARD_CLASS =
  "overflow-hidden rounded-2xl border border-border bg-surface";
export const CARD_IMAGE_CLASS = "relative aspect-[16/10] w-full";
export const CARD_BODY_CLASS = "flex h-40 flex-col justify-between p-4";
export const CONTROL_HEIGHT_CLASS = "h-11";
export const CONTROL_WIDTH_CLASS = {
  multi: "w-44",
  range: "w-64",
  sort: "w-52",
  toggle: "w-44",
} as const;
export const LOAD_MORE_ROW_CLASS = "flex h-11 items-center justify-center";
export const SUMMARY_CLASS = "h-7 text-sm text-muted";
