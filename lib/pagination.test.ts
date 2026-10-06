import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { appendPage, createFeed } from "./pagination.ts";
import { makeGame } from "./testing/make-game.ts";

const page = (ids: string[], pageId: number, total: number) => ({
  games: ids.map((id) => makeGame({ id })),
  pageId,
  total,
});

describe("pagination", () => {
  it("reports more pages while fewer than total games are loaded", () => {
    const feed = createFeed("", page(["a", "b"], 1, 5));
    assert.equal(feed.hasMore, true);
    assert.equal(feed.nextPageId, 2);
  });

  it("copes with pages larger than the requested size", () => {
    const feed = appendPage(createFeed("q", page(["a", "b", "c", "d"], 1, 6)), page(["e", "f"], 2, 6));
    assert.equal(feed.games.length, 6);
    assert.equal(feed.hasMore, false);
  });

  it("drops duplicates and stops when a page adds nothing new", () => {
    const first = createFeed("", page(["a", "b"], 1, 10));
    const next = appendPage(first, page(["a", "b"], 2, 10));
    assert.equal(next.games.length, 2);
    assert.equal(next.hasMore, false);
  });

  it("stops on an empty page even if total says otherwise", () => {
    const feed = appendPage(createFeed("", page(["a"], 1, 99)), page([], 2, 99));
    assert.equal(feed.hasMore, false);
  });
});
