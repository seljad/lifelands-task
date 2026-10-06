import { Suspense } from "react";
import { Snow } from "../components/snow.tsx";
import { GamesErrorBoundary } from "../components/games/games-error-boundary.tsx";
import { GamesSection } from "../components/games/games-section.tsx";
import { GamesSkeleton } from "../components/games/games-skeleton.tsx";
import { getFeedQuery, parseFilterState } from "../lib/filters/state.ts";

export default async function HomePage({ searchParams }: PageProps<"/">) {
  const params = await searchParams;
  const query = getFeedQuery(
    parseFilterState({
      get: (key) => {
        const value = params[key];
        return typeof value === "string" ? value : null;
      },
    }),
  );

  return (
    <>
      <Snow />
      <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
      <header className="mb-8 space-y-2">
        <h1 className="text-3xl font-extrabold sm:text-4xl">بازی ها</h1>
      </header>
      <GamesErrorBoundary>
        <Suspense fallback={<GamesSkeleton />}>
          <GamesSection query={query} />
        </Suspense>
      </GamesErrorBoundary>
      </main>
    </>
  );
}
