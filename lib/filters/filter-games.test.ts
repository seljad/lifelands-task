import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { browse, makeGame, search } from "../testing/make-game.ts";
import { filterGames } from "./filter-games.ts";

const NO_FAVORITES: ReadonlySet<string> = new Set();

const games = [
  makeGame({
    id: "1",
    title: "Epic Ludo",
    companyName: "Vahid",
    category: "امتیازی",
    vendors: ["soroush"],
    score: 4.5,
    like: 10,
  }),
  makeGame({
    id: "2",
    title: "لودو ۲",
    companyName: "استودیو کوهستان",
    category: "معمایی",
    vendors: ["rubika", "soroush"],
    score: 3,
  }),
  makeGame({ id: "3", title: "Racer", companyName: "", category: "رانندگی" }),
];

function ids(result: readonly { id: string }[]): string[] {
  return result.map((game) => game.id);
}

describe("filterGames", () => {
  it("matches title and company name after normalizing both sides", () => {
    assert.deepEqual(ids(filterGames(games, search("EPIC"), NO_FAVORITES)), ["1"]);
    assert.deepEqual(ids(filterGames(games, search("vahid"), NO_FAVORITES)), ["1"]);
    assert.deepEqual(ids(filterGames(games, search("كوهستان"), NO_FAVORITES)), ["2"]);
    assert.deepEqual(ids(filterGames(games, search("لودو ٢"), NO_FAVORITES)), ["2"]);
  });

  it("requires every search token to match", () => {
    assert.deepEqual(ids(filterGames(games, search("ludo vahid"), NO_FAVORITES)), ["1"]);
    assert.deepEqual(ids(filterGames(games, search("ludo racer"), NO_FAVORITES)), []);
  });

  it("ORs values inside one filter and ANDs across filters", () => {
    const either = browse({ selections: { vendor: ["rubika", "soroush"] } });
    assert.deepEqual(ids(filterGames(games, either, NO_FAVORITES)), ["1", "2"]);

    const both = browse({
      selections: { vendor: ["soroush"], category: ["معمایی"] },
    });
    assert.deepEqual(ids(filterGames(games, both, NO_FAVORITES)), ["2"]);
  });

  it("puts games without vendors in the unspecified bucket", () => {
    const unspecified = browse({ selections: { vendor: ["unspecified"] } });
    assert.deepEqual(ids(filterGames(games, unspecified, NO_FAVORITES)), ["3"]);
  });

  it("applies range minimums", () => {
    const state = browse({ minimums: { score: 4, like: 5 } });
    assert.deepEqual(ids(filterGames(games, state, NO_FAVORITES)), ["1"]);
  });

  it("restricts to favorites when requested", () => {
    const state = browse({ favoritesOnly: true });
    assert.deepEqual(ids(filterGames(games, state, new Set(["2"]))), ["2"]);
    assert.deepEqual(ids(filterGames(games, state, NO_FAVORITES)), []);
  });

  it("returns every game when nothing is active", () => {
    assert.deepEqual(ids(filterGames(games, browse(), NO_FAVORITES)), ["1", "2", "3"]);
  });
});
