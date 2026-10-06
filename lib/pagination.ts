import type { Game, GamesPage } from "./types/game.ts";

export type Feed = {
  query: string;
  games: readonly Game[];
  nextPageId: number;
  total: number;
  hasMore: boolean;
};

/**
 * `total` and `eachPerPage` are hints, not guarantees: the search endpoint
 * returns up to twice `eachPerPage` items per page and its `total` is the sum
 * of two lists. So "more" is decided by what actually arrived: the page must
 * contribute at least one unseen game and fewer than `total` are loaded.
 */
export function appendPage(feed: Feed, page: GamesPage): Feed {
  const seen = new Set(feed.games.map((game) => game.id));
  const fresh = page.games.filter((game) => !seen.has(game.id));
  const games = [...feed.games, ...fresh];

  return {
    query: feed.query,
    games,
    nextPageId: page.pageId + 1,
    total: page.total,
    hasMore: fresh.length > 0 && games.length < page.total,
  };
}

export function createFeed(query: string, page: GamesPage): Feed {
  return appendPage(
    { query, games: [], nextPageId: 1, total: 0, hasMore: false },
    page,
  );
}
