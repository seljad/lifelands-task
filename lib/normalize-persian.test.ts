import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { normalizePersian } from "./normalize-persian.ts";

describe("normalizePersian", () => {
  it("unifies Arabic yeh and kaf with their Persian forms", () => {
    assert.equal(normalizePersian("كتاب علي"), "کتاب علی");
    assert.equal(normalizePersian("موسى"), "موسی");
  });

  it("converts Persian and Arabic-Indic digits to Latin digits", () => {
    assert.equal(normalizePersian("بازی ۱۲۳"), "بازی 123");
    assert.equal(normalizePersian("level ٤٥٦"), "level 456");
  });

  it("removes ZWNJ and collapses whitespace", () => {
    assert.equal(normalizePersian("  می‌خواهم   بازی\n\tکنم "), "میخواهم بازی کنم");
  });

  it("lowercases Latin text and strips diacritics and tatweel", () => {
    assert.equal(normalizePersian("Epic LUDO"), "epic ludo");
    assert.equal(normalizePersian("مَدرســه"), "مدرسه");
  });

  it("makes differently typed spellings equal", () => {
    assert.equal(normalizePersian("يك‌بازي ۲"), normalizePersian("یکبازی 2"));
  });

  it("returns an empty string for blank input", () => {
    assert.equal(normalizePersian(" ‌  "), "");
  });
});
