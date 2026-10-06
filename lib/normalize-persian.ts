const ARABIC_INDIC_ZERO = 0x0660;
const EXTENDED_ARABIC_INDIC_ZERO = 0x06f0;

const LETTER_UNIFICATION: Readonly<Record<string, string>> = {
  "ي": "ی",
  "ى": "ی",
  "ك": "ک",
};

const DIGITS = /[٠-٩۰-۹]/g;
const LETTERS = /[يىك]/g;
const INVISIBLE_MARKS = /[​-‏]/g;
const DIACRITICS_AND_TATWEEL = /[ً-ٰٟـ]/g;
const WHITESPACE = /\s+/g;

function toLatinDigit(digit: string): string {
  const code = digit.charCodeAt(0);
  const zero = code >= EXTENDED_ARABIC_INDIC_ZERO
    ? EXTENDED_ARABIC_INDIC_ZERO
    : ARABIC_INDIC_ZERO;
  return String(code - zero);
}

/**
 * Canonical form used for both the query and the searched text, so that
 * visually identical Persian strings always compare equal.
 */
export function normalizePersian(input: string): string {
  return input
    .normalize("NFKC")
    .replace(LETTERS, (letter) => LETTER_UNIFICATION[letter])
    .replace(DIGITS, toLatinDigit)
    .replace(INVISIBLE_MARKS, "")
    .replace(DIACRITICS_AND_TATWEEL, "")
    .toLowerCase()
    .replace(WHITESPACE, " ")
    .trim();
}
