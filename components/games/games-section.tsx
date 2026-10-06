import { fetchGamesPage } from "@/lib/api/lifelands.ts";
import { createFeed } from "@/lib/pagination.ts";
import { GameExplorer } from "./game-explorer.tsx";

export async function GamesSection({ query }: { query: string }) {
  const page = await fetchGamesPage({ pageId: 1, query });
  return <GameExplorer initialFeed={createFeed(query, page)} />;
}
