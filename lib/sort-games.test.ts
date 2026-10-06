import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { sortGames } from "./sort-games.ts";
import { makeGame } from "./testing/make-game.ts";

describe("sortGames", () => {
  const games = [
    makeGame({ id: "a", score: 3, runCount: 10 }),
    makeGame({ id: "b", score: 5, runCount: 1 }),
    makeGame({ id: "c", score: 4, runCount: 99 }),
  ];

  it("sorts descending by a numeric key without mutating the input", () => {
    assert.deepEqual(sortGames(games, "score").map((game) => game.id), ["b", "c", "a"]);
    assert.deepEqual(sortGames(games, "runCount").map((game) => game.id), ["c", "a", "b"]);
    assert.deepEqual(games.map((game) => game.id), ["a", "b", "c"]);
  });

  it("keeps the original order for ties", () => {
    const tied = [makeGame({ id: "x" }), makeGame({ id: "y" })];
    assert.deepEqual(sortGames(tied, "like").map((game) => game.id), ["x", "y"]);
  });

  it("only accepts numeric Game keys", () => {
    // @ts-expect-error "title" is a string field
    sortGames(games, "title");
    // @ts-expect-error unknown key
    sortGames(games, "popularity");
  });
});
