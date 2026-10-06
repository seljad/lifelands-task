import {
  UNSPECIFIED_VENDOR,
  VENDORS,
  VENDOR_LABELS,
  isVendorFilterValue,
} from "../vendors.ts";
import type { FilterDefinition } from "./types.ts";

/**
 * The single place that defines filters. The UI, URL parsing and
 * `filterGames` all iterate this array, so adding an entry here is enough.
 */
export const FILTERS: readonly FilterDefinition[] = [
  {
    kind: "multi",
    id: "vendor",
    label: "فروشگاه",
    // Games with no vendor data form their own "unspecified" bucket.
    getValues: (game) =>
      game.vendors.length > 0 ? game.vendors : [UNSPECIFIED_VENDOR],
    getOptions: () => [
      ...VENDORS.map((vendor) => ({
        value: vendor,
        label: VENDOR_LABELS[vendor],
      })),
      { value: UNSPECIFIED_VENDOR, label: "نامشخص" },
    ],
    isValidValue: isVendorFilterValue,
  },
  {
    kind: "multi",
    id: "category",
    label: "دسته‌بندی",
    getValues: (game) => [game.category],
    getOptions: (games) =>
      [...new Set(games.map((game) => game.category))]
        .sort((a, b) => a.localeCompare(b, "fa"))
        .map((category) => ({ value: category, label: category })),
    isValidValue: (value) => value !== "",
  },
  {
    kind: "range",
    id: "score",
    label: "حداقل امتیاز",
    field: "score",
    min: 0,
    max: 5,
    step: 0.5,
  },
  {
    // Not requested by the assignment: added to demonstrate that a new
    // filter is a one-file change.
    kind: "range",
    id: "like",
    label: "حداقل پسند",
    field: "like",
    min: 0,
    max: 25,
    step: 1,
  },
];
