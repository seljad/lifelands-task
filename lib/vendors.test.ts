import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isVendor, isVendorFilterValue } from "./vendors.ts";

describe("vendor guards", () => {
  it("narrows only supported vendors", () => {
    assert.equal(isVendor("soroush"), true);
    assert.equal(isVendor("rubika"), true);
    assert.equal(isVendor("bale"), false);
    assert.equal(isVendor(""), false);
  });

  it("accepts the unspecified bucket as a filter value only", () => {
    assert.equal(isVendorFilterValue("unspecified"), true);
    assert.equal(isVendor("unspecified"), false);
  });
});
