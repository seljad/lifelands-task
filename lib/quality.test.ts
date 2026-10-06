import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { calculateQuality } from "./quality.ts";

describe("calculateQuality", () => {
  it("is 0 when every signal is missing", () => {
    assert.equal(calculateQuality({ score: 0, rating: 0, like: 0 }), 0);
  });

  it("still credits rating and likes when score is 0", () => {
    assert.ok(calculateQuality({ score: 0, rating: 0.5, like: 5 }) > 0);
  });

  it("caps each signal so outliers cannot exceed 100", () => {
    assert.equal(calculateQuality({ score: 5, rating: 3.05, like: 1000 }), 100);
  });

  it("ranks a well-rated game above a barely rated one", () => {
    const strong = calculateQuality({ score: 4.9, rating: 0.95, like: 11 });
    const weak = calculateQuality({ score: 3.8, rating: 0.5, like: 3 });
    assert.ok(strong > weak);
  });
});
