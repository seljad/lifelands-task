"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { useFavorites } from "@/hooks/use-favorites.ts";
import { useGameFeed } from "@/hooks/use-game-feed.ts";
import { selectGames } from "@/lib/filters/select-games.ts";
import {
  ALL_PARAM_KEYS,
  getFeedQuery,
  parseFilterState,
} from "@/lib/filters/state.ts";
import { formatNumber } from "@/lib/format.ts";
import type { Feed } from "@/lib/pagination.ts";
import { scheduleUrlUpdate } from "@/lib/url-writer.ts";
import { FeedbackPanel } from "./feedback-panels.tsx";
import { FilterBar } from "./filter-bar.tsx";
import { GameGrid } from "./game-grid.tsx";
import { GameGridSkeleton } from "./games-skeleton.tsx";
import {
  LOAD_MORE_ROW_CLASS,
  SUMMARY_CLASS,
} from "./layout.ts";

const NO_FAVORITES: ReadonlySet<string> = new Set();

function clearAllFilters(): void {
  for (const key of ALL_PARAM_KEYS) scheduleUrlUpdate(key, null, "push");
}

export function GameExplorer({ initialFeed }: { initialFeed: Feed }) {
  const searchParams = useSearchParams();
  const state = useMemo(() => parseFilterState(searchParams), [searchParams]);
  const feed = useGameFeed(initialFeed, getFeedQuery(state));
  const { favorites, toggle } = useFavorites();

  const activeFavorites = state.criteria.favoritesOnly ? favorites : NO_FAVORITES;
  const visibleGames = useMemo(
    () => selectGames(feed.games, state, activeFavorites),
    [feed.games, state, activeFavorites],
  );

  return (
    <div className="space-y-5">
      <FilterBar state={state} games={feed.games} />

      <p className={SUMMARY_CLASS} role="status" aria-live="polite">
        {feed.isRefreshing
          ? "در حال جستجو…"
          : `${formatNumber(visibleGames.length)} بازی نمایش داده می‌شود · ${formatNumber(feed.games.length)} از ${formatNumber(feed.total)} بازی بارگذاری شده است`}
      </p>

      {feed.error === "refresh" ? (
        <FeedbackPanel
          tone="error"
          title="دریافت بازی‌ها ناموفق بود"
          description="ارتباط با سرور برقرار نشد. اتصال اینترنت را بررسی کنید و دوباره تلاش کنید."
          actions={[{ label: "تلاش دوباره", onClick: feed.retry, primary: true }]}
        />
      ) : feed.isRefreshing ? (
        <GameGridSkeleton />
      ) : visibleGames.length === 0 ? (
        <FeedbackPanel
          title="بازی‌ای پیدا نشد"
          description={
            feed.hasMore
              ? "بین بازی‌هایی که تا اینجا بارگذاری شده‌اند موردی با این شرایط نیست. می‌توانید بازی‌های بیشتری بارگذاری کنید یا فیلترها را پاک کنید."
              : "هیچ بازی‌ای با جستجو و فیلترهای فعلی مطابقت ندارد."
          }
          actions={[
            { label: "پاک کردن جستجو و فیلترها", onClick: clearAllFilters, primary: true },
            ...(feed.hasMore
              ? [{ label: "بارگذاری بازی‌های بیشتر", onClick: feed.loadMore }]
              : []),
          ]}
        />
      ) : (
        <GameGrid
          games={visibleGames}
          favorites={favorites}
          onToggleFavorite={toggle}
        />
      )}

      {!feed.isRefreshing && feed.error !== "refresh" && (feed.hasMore || feed.error === "more") && (
        <div className={`${LOAD_MORE_ROW_CLASS} gap-3`}>
          {feed.error === "more" && (
            <p role="alert" className="text-sm text-danger">
              بارگذاری بازی‌های بیشتر ناموفق بود.
            </p>
          )}
          <button
            type="button"
            onClick={feed.error === "more" ? feed.retry : feed.loadMore}
            disabled={feed.isLoadingMore}
            aria-busy={feed.isLoadingMore}
            className="h-11 rounded-xl border border-border bg-surface px-6 text-sm font-semibold transition-colors hover:bg-surface-muted disabled:opacity-60"
          >
            {feed.isLoadingMore
              ? "در حال بارگذاری…"
              : feed.error === "more"
                ? "تلاش دوباره"
                : "نمایش بازی‌های بیشتر"}
          </button>
        </div>
      )}
    </div>
  );
}
