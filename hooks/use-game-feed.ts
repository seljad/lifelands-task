"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { fetchGamesPageViaProxy } from "../lib/api/client.ts";
import { appendPage, createFeed } from "../lib/pagination.ts";
import type { Feed } from "../lib/pagination.ts";
import type { Game } from "../lib/types/game.ts";

type FailedRequest = { kind: "refresh" | "more"; query: string };

export type GameFeed = {
  games: readonly Game[];
  total: number;
  hasMore: boolean;
  isRefreshing: boolean;
  isLoadingMore: boolean;
  error: FailedRequest["kind"] | null;
  loadMore: () => void;
  retry: () => void;
};

export function useGameFeed(initialFeed: Feed, query: string): GameFeed {
  const [feed, setFeed] = useState(initialFeed);
  const [failure, setFailure] = useState<FailedRequest | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const loadMoreController = useRef<AbortController | null>(null);

  useEffect(() => {
    if (feed.query === query) return;

    const controller = new AbortController();
    fetchGamesPageViaProxy({ pageId: 1, query }, controller.signal)
      .then((page) => {
        loadMoreController.current?.abort();
        setFeed(createFeed(query, page));
      })
      .catch(() => {
        if (!controller.signal.aborted) setFailure({ kind: "refresh", query });
      });

    return () => controller.abort();
  }, [feed.query, query, attempt]);

  const loadMore = useCallback(() => {
    const { query: requestQuery, nextPageId } = feed;
    const controller = new AbortController();
    loadMoreController.current = controller;
    setIsLoadingMore(true);
    setFailure(null);

    fetchGamesPageViaProxy(
      { pageId: nextPageId, query: requestQuery },
      controller.signal,
    )
      .then((page) => {
        setFeed((current) =>
          current.query === requestQuery ? appendPage(current, page) : current,
        );
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setFailure({ kind: "more", query: requestQuery });
        }
      })
      .finally(() => {
        if (loadMoreController.current === controller) setIsLoadingMore(false);
      });
  }, [feed]);

  useEffect(() => () => loadMoreController.current?.abort(), []);

  const retry = useCallback(() => {
    if (failure?.kind === "more") {
      loadMore();
      return;
    }
    setFailure(null);
    setAttempt((value) => value + 1);
  }, [failure, loadMore]);

  const error =
    failure?.kind === "refresh" && failure.query === query
      ? "refresh"
      : failure?.kind === "more" && failure.query === feed.query
        ? "more"
        : null;

  return {
    games: feed.games,
    total: feed.total,
    hasMore: feed.query === query && feed.hasMore,
    isRefreshing: feed.query !== query && error !== "refresh",
    isLoadingMore,
    error,
    loadMore,
    retry,
  };
}
