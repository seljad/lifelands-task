import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { booleanCodec, numberCodec, stringCodec, stringListCodec } from "./url-codecs.ts";

describe("url codecs", () => {
  it("falls back when the param is absent", () => {
    assert.equal(stringCodec.parse(null, "x"), "x");
    assert.deepEqual(stringListCodec.parse(null, ["d"]), ["d"]);
    assert.equal(booleanCodec.parse(null, true), true);
    assert.equal(numberCodec.parse(null, 2), 2);
  });

  it("parses lists, booleans and numbers", () => {
    assert.deepEqual(stringListCodec.parse("a,,b", []), ["a", "b"]);
    assert.equal(booleanCodec.parse("1", false), true);
    assert.equal(booleanCodec.parse("0", true), false);
    assert.equal(numberCodec.parse("3.5", 0), 3.5);
    assert.equal(numberCodec.parse("abc", 1), 1);
  });

  it("serializes empty values to null so they leave the URL", () => {
    assert.equal(stringCodec.serialize(""), null);
    assert.equal(stringListCodec.serialize([]), null);
    assert.equal(booleanCodec.serialize(false), null);
    assert.equal(stringListCodec.serialize(["a", "b"]), "a,b");
  });
});
