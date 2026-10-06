import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { RawGame } from "../types/api.ts";
import { mapGame } from "./map-game.ts";

const raw: RawGame = {
  _id: "1",
  title: "  Epic Ludo ",
  image: "game/a.webp",
  category: { title: "امتیازی " },
  score: 0,
  rating: 0.5,
  like: 2,
  seenCount: 10,
  runCount: 5,
};

describe("mapGame", () => {
  it("trims text, resolves the image and tolerates missing optional fields", () => {
    const game = mapGame(raw);
    assert.equal(game.title, "Epic Ludo");
    assert.equal(game.category, "امتیازی");
    assert.equal(game.companyName, "");
    assert.deepEqual(game.vendors, []);
    assert.equal(game.imageUrl, "https://dl.lifelands.ir/game/a.webp");
    assert.ok(game.quality > 0);
  });

  it("keeps only supported vendors", () => {
    const game = mapGame({ ...raw, vitrinThirdPartyVendors: ["rubika", "bale"] });
    assert.deepEqual(game.vendors, ["rubika"]);
  });

  it("replaces non-finite numbers with 0", () => {
    assert.equal(mapGame({ ...raw, like: Number.NaN }).like, 0);
  });
});
