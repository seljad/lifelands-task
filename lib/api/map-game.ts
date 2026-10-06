import { calculateQuality } from "../quality.ts";
import { resolveImageUrl } from "../image-url.ts";
import type { RawGame } from "../types/api.ts";
import type { Game } from "../types/game.ts";
import { isVendor } from "../vendors.ts";

function toFiniteNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function mapGame(raw: RawGame): Game {
  const score = toFiniteNumber(raw.score);
  const rating = toFiniteNumber(raw.rating);
  const like = toFiniteNumber(raw.like);

  return {
    id: raw._id,
    title: raw.title.trim(),
    companyName: raw.companyName?.trim() ?? "",
    category: raw.category.title.trim(),
    imageUrl: resolveImageUrl(raw.image),
    vendors: (raw.vitrinThirdPartyVendors ?? []).filter(isVendor),
    score,
    rating,
    like,
    seenCount: toFiniteNumber(raw.seenCount),
    runCount: toFiniteNumber(raw.runCount),
    quality: calculateQuality({ score, rating, like }),
  };
}
