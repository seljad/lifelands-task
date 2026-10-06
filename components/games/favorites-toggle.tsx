"use client";

import { useFavorites } from "@/hooks/use-favorites.ts";
import { useUrlState } from "@/hooks/use-url-state.ts";
import { formatNumber } from "@/lib/format.ts";
import { FAVORITES_PARAM } from "@/lib/filters/state.ts";
import { booleanCodec } from "@/lib/url-codecs.ts";
import { CONTROL_HEIGHT_CLASS, CONTROL_WIDTH_CLASS } from "./layout.ts";

export function FavoritesToggle() {
  const { favorites } = useFavorites();
  const [favoritesOnly, setFavoritesOnly] = useUrlState(
    FAVORITES_PARAM,
    false,
    booleanCodec,
  );

  return (
    <button
      type="button"
      aria-pressed={favoritesOnly}
      onClick={() => setFavoritesOnly(!favoritesOnly)}
      className={`${CONTROL_HEIGHT_CLASS} ${CONTROL_WIDTH_CLASS.toggle} rounded-xl border px-4 text-sm transition-colors ${
        favoritesOnly
          ? "border-accent bg-accent font-semibold text-accent-foreground"
          : "border-border bg-surface"
      }`}
    >
      فقط علاقه‌مندی‌ها ({formatNumber(favorites.size)})
    </button>
  );
}
