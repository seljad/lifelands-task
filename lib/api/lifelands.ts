import {
  API_BASE_URL,
  GAMES_REVALIDATE_SECONDS,
  PAGE_SIZE,
} from "../config.ts";
import type { RawGamesResponse } from "../types/api.ts";
import type { GamesPage, GamesPageRequest } from "../types/game.ts";
import { mapGame } from "./map-game.ts";

export class UpstreamError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UpstreamError";
  }
}

function buildUrl({ pageId, query }: GamesPageRequest): string {
  const params = new URLSearchParams({
    pageId: String(pageId),
    eachPerPage: String(PAGE_SIZE),
  });

  if (query === "") {
    return `${API_BASE_URL}/games?${params}`;
  }

  params.set("searchValue", query);
  params.set("department", "game");
  return `${API_BASE_URL}/post/search/engine?${params}`;
}

/** Server-only: talks to the Lifelands API and strips it down to `Game`s. */
export async function fetchGamesPage(
  request: GamesPageRequest,
): Promise<GamesPage> {
  const response = await fetch(buildUrl(request), {
    next: { revalidate: GAMES_REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    throw new UpstreamError(`Lifelands API responded with ${response.status}`);
  }

  const body: RawGamesResponse = await response.json();

  if (!body.state || !Array.isArray(body.data.games)) {
    throw new UpstreamError("Unexpected Lifelands API response shape");
  }

  return {
    games: body.data.games.map(mapGame),
    pageId: body.data.pageId,
    total: body.data.total,
  };
}
