import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { browse, makeGame } from "../testing/make-game.ts";
import { selectGames } from "./select-games.ts";
import { getFilterOptions } from "./options.ts";
import { FILTERS } from "./config.ts";

const games = [
  makeGame({ id: "a", category: "اکشن", score: 1 }),
  makeGame({ id: "b", category: "معمایی", score: 5 }),
];

describe("selectGames", () => {
  it("keeps source order for default sort and sorts otherwise", () => {
    assert.deepEqual(selectGames(games, browse(), new Set()).map((g) => g.id), ["a", "b"]);
    const byScore = { ...browse(), sort: "score" as const };
    assert.deepEqual(selectGames(games, byScore, new Set()).map((g) => g.id), ["b", "a"]);
  });
});

describe("getFilterOptions", () => {
  it("lists unique sorted categories and keeps URL-restored values", () => {
    const category = FILTERS.find((filter) => filter.id === "category");
    assert.ok(category && category.kind === "multi");
    const options = getFilterOptions(category, games, ["ورزشی"]);
    assert.deepEqual(options.map((option) => option.value), ["اکشن", "معمایی", "ورزشی"]);
  });
});
