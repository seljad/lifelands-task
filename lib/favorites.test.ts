import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseFavorites, serializeFavorites, toggleFavorite } from "./favorites.ts";

describe("favorites", () => {
  it("round-trips through JSON", () => {
    const raw = serializeFavorites(new Set(["a", "b"]));
    assert.deepEqual([...parseFavorites(raw)], ["a", "b"]);
  });

  it("ignores corrupt or malformed storage", () => {
    assert.equal(parseFavorites("{oops").size, 0);
    assert.equal(parseFavorites('{"a":1}').size, 0);
    assert.deepEqual([...parseFavorites('["a",1,null]')], ["a"]);
    assert.equal(parseFavorites(null).size, 0);
  });

  it("toggles without mutating the original set", () => {
    const original = new Set(["a"]);
    assert.deepEqual([...toggleFavorite(original, "b")], ["a", "b"]);
    assert.deepEqual([...toggleFavorite(original, "a")], []);
    assert.deepEqual([...original], ["a"]);
  });
});
