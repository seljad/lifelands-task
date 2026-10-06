import type { GamesPage, GamesPageRequest } from "../types/game.ts";

export async function fetchGamesPageViaProxy(
  { pageId, query }: GamesPageRequest,
  signal: AbortSignal,
): Promise<GamesPage> {
  const params = new URLSearchParams({ pageId: String(pageId), q: query });
  const response = await fetch(`/api/games?${params}`, { signal });

  if (!response.ok) {
    throw new Error(`Games request failed with ${response.status}`);
  }

  const page: GamesPage = await response.json();
  return page;
}
