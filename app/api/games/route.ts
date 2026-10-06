import { NextResponse } from "next/server";
import { fetchGamesPage } from "../../../lib/api/lifelands.ts";
import { MAX_QUERY_LENGTH } from "../../../lib/config.ts";
import { normalizePersian } from "../../../lib/normalize-persian.ts";

const MAX_PAGE_ID = 1000;

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

/** Same-origin proxy so the browser never talks to the Lifelands API. */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pageId = Number(searchParams.get("pageId") ?? "1");
  const query = normalizePersian(searchParams.get("q") ?? "");

  if (!Number.isInteger(pageId) || pageId < 1 || pageId > MAX_PAGE_ID) {
    return badRequest("Invalid pageId");
  }
  if (query.length > MAX_QUERY_LENGTH) {
    return badRequest("Query too long");
  }

  try {
    return NextResponse.json(await fetchGamesPage({ pageId, query }));
  } catch {
    return NextResponse.json({ error: "Upstream request failed" }, { status: 502 });
  }
}
