const SCORE_MAX = 5;
const RATING_CAP = 1.5;
const LIKE_CAP = 25;

const WEIGHTS = { score: 0.5, rating: 0.3, like: 0.2 } as const;

type QualitySignals = {
  score: number;
  rating: number;
  like: number;
};

function clampUnit(value: number): number {
  return Math.min(Math.max(value, 0), 1);
}

/**
 * Blends three weak, partially-missing signals into one 0–100 number:
 *   quality = 100 × (0.5·score/5 + 0.3·min(rating/1.5, 1) + 0.2·ln(1+like)/ln(1+25))
 * Each signal is scaled to 0–1 first. Missing signals are 0, so a game with
 * `score = 0` but a real `rating` and likes still ranks above one with nothing.
 * Likes are log-scaled because the distribution is heavily skewed (max 23,
 * median 0); the rating cap absorbs a few outliers (max 3.05, p95 1.08).
 */
export function calculateQuality({ score, rating, like }: QualitySignals): number {
  const normalized =
    WEIGHTS.score * clampUnit(score / SCORE_MAX) +
    WEIGHTS.rating * clampUnit(rating / RATING_CAP) +
    WEIGHTS.like * clampUnit(Math.log1p(like) / Math.log1p(LIKE_CAP));
  return Math.round(normalized * 1000) / 10;
}
