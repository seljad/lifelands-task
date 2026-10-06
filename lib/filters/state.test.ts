import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createFilterState, parseFilterState } from "./state.ts";
import type { BrowseFilterState, SearchFilterState } from "./state.ts";
import { EMPTY_CRITERIA } from "../testing/make-game.ts";

function paramsOf(entries: Record<string, string>) {
  return { get: (key: string) => entries[key] ?? null };
}

describe("filter state", () => {
  it("rejects incompatible combinations at compile time", () => {
    const browse: BrowseFilterState = {
      mode: "browse",
      // @ts-expect-error "relevance" only exists while searching
      sort: "relevance",
      criteria: EMPTY_CRITERIA,
    };
    const searching: SearchFilterState = {
      mode: "search",
      query: "ludo",
      // @ts-expect-error "default" only exists while browsing
      sort: "default",
      criteria: EMPTY_CRITERIA,
    };
    // @ts-expect-error browse mode cannot carry a query
    const withQuery: BrowseFilterState = { mode: "browse", query: "x", sort: "default", criteria: EMPTY_CRITERIA };
    assert.ok(browse && searching && withQuery);
  });

  it("enters search mode only for a non-empty normalized query", () => {
    assert.equal(createFilterState("  ‌ ", null, EMPTY_CRITERIA).mode, "browse");
    const state = createFilterState("كتاب ۱", null, EMPTY_CRITERIA);
    assert.equal(state.mode, "search");
    assert.equal(state.mode === "search" && state.query, "کتاب 1");
  });

  it("coerces a sort that does not fit the mode to that mode's default", () => {
    assert.equal(createFilterState("", "relevance", EMPTY_CRITERIA).sort, "default");
    assert.equal(createFilterState("ludo", "default", EMPTY_CRITERIA).sort, "relevance");
    assert.equal(createFilterState("ludo", "like", EMPTY_CRITERIA).sort, "like");
    assert.equal(createFilterState("", "bogus", EMPTY_CRITERIA).sort, "default");
  });

  it("parses criteria from the URL and drops invalid values", () => {
    const state = parseFilterState(
      paramsOf({ vendor: "soroush,evil,unspecified", score: "9", like: "abc", fav: "1" }),
    );
    assert.deepEqual(state.criteria.selections.vendor, ["soroush", "unspecified"]);
    assert.equal(state.criteria.minimums.score, 5);
    assert.equal(state.criteria.minimums.like, 0);
    assert.equal(state.criteria.favoritesOnly, true);
  });
});
