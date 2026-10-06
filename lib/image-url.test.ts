import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { resolveImageUrl } from "./image-url.ts";

describe("resolveImageUrl", () => {
  it("resolves relative paths against the CDN", () => {
    assert.equal(
      resolveImageUrl("game/file-1.webp"),
      "https://dl.lifelands.ir/game/file-1.webp",
    );
    assert.equal(
      resolveImageUrl("/game/file-1.webp"),
      "https://dl.lifelands.ir/game/file-1.webp",
    );
  });

  it("keeps absolute URLs untouched", () => {
    assert.equal(resolveImageUrl("https://example.com/a.png"), "https://example.com/a.png");
  });

  it("percent-encodes unsafe characters", () => {
    assert.equal(
      resolveImageUrl("game/my file.png"),
      "https://dl.lifelands.ir/game/my%20file.png",
    );
  });
});
