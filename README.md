# Lifelands Game Explorer

A single, production-oriented section — a **Game Explorer** — that renders games from the live Lifelands API (`GET https://lifelands.ir/api/v1/games`). UI copy is Persian (RTL).

**Scenario:** "Discover your next favorite game." A visitor searches by name or studio (with Persian-aware matching), narrows by store/category/score/likes, sorts by popularity or a blended quality score, stars favorites, and shares the exact state as a link.

- Repository: _add GitHub link_
- Deployed: _add Vercel link_

## Tech stack

| | Version |
|---|---|
| Next.js (App Router, Turbopack) | 16.3.8 |
| React | 19.2.8 |
| TypeScript (`strict: true`) | ^5 |
| Tailwind CSS | ^4 |
| Font | Vazirmatn via `next/font/google` |
| Tests | Node built-in test runner (Node ≥ 22.18, no extra deps) |

No UI kit, no state/URL/debounce libraries.

## How to run

```bash
git clone <repo-url>
cd task
npm install
npm run dev          # http://localhost:3000
```

Other scripts: `npm run build`, `npm start`, `npm run lint`, `npm run typecheck`, `npm test`.

## What the API actually returns (inspected before writing types)

Types in `lib/types/api.ts` were derived from the real responses (all 726 games were fetched and analysed), not from any tutorial:

- Query params are `pageId` and `eachPerPage` (`page=` is silently ignored). `eachPerPage` is capped at 100.
- `vitrinThirdPartyVendors` is **missing on 309 games, empty on 396, and set on only 38**; only `soroush` and `rubika` occur. `companyName` is missing on 5 games.
- `score`/`rating` are sometimes floats (score 0–5, rating 0–3.05). Category titles and game titles carry stray whitespace.
- `image` is a relative path (`game/file-….webp`) served from `https://dl.lifelands.ir/`. `.jfif` files are served as `application/octet-stream` (Next's optimizer still handles them).
- `createdAt`/`updatedAt` are relative Persian strings ("13 روز پیش"), so the app ignores them.
- The raw items include creator profiles with `sessionId`, `phoneNumber`, etc. `mapGame` strips everything except the fields the UI uses, so none of that reaches the browser.
- `games` and `gamesWithoutConsole` are identical; only `games` is used.
- **Search** lives on a different endpoint: `/post/search/engine?searchValue=…&department=game`. It matches more than title/company (category, description), merges two lists per page, and returns up to **2 × `eachPerPage`** items with `total` being the sum of both lists (see Task 8.4).

## Architecture

```
app/
  page.tsx                  Server Component – reads searchParams, Suspense + error boundary
  api/games/route.ts        Same-origin proxy (the browser never calls lifelands.ir)
components/games/           UI (see Server/Client split below)
hooks/                      useDebounce, useUrlState, useFavorites, useGameFeed
lib/                        Pure logic, zero React imports, unit-tested
  api/                      fetch + mapping (server), proxy client (browser)
  filters/                  filter config, state union, filterGames, options
```

### Server / Client split (Task 7.1)

**Server Components** (no `'use client'`):
- `app/page.tsx` – reads `searchParams`, renders the header and streaming boundary.
- `components/games/games-section.tsx` – does the initial `fetch` on the server (no `useEffect` load) and hands a serialisable `Feed` to the client.
- `components/games/games-skeleton.tsx` – the Suspense fallback; needs no interactivity.
- `filter-bar.tsx`, `game-grid.tsx` and `feedback-panels.tsx` have no directive and no hooks, but they are only imported from client components, so in practice they run in the client bundle.

**Client Components** – only where interactivity requires it: `game-explorer.tsx` (owns the feed and URL state), `search-box`, `multi-filter`, `range-filter`, `sort-select`, `favorites-toggle`, `game-card` (memoised), `game-image` (error state), `games-error-boundary` (class boundaries must be client).

The page itself is never `'use client'`.

### Streaming, `loading.tsx` and CLS (Task 7.2)

The list is wrapped in `<Suspense fallback={<GamesSkeleton/>}>` at **component level**, so the header and shell paint immediately and only the list streams in. I did **not** add `loading.tsx`: it is route-level, i.e. an implicit Suspense boundary around the *whole* page segment, which would also hide the header while the data loads. Component-level streaming keeps static content visible. The skeleton and real components share dimension constants (`components/games/layout.ts`: grid, card image ratio, fixed card body height, control sizes) and the skeleton renders the same number of controls from the filter config, so streaming in causes no layout shift. The same skeleton grid is reused while a new search is loading.

### Revalidation (Task 7.3)

`revalidate = 600` (10 min) on the upstream fetch. The catalogue itself changes slowly (the latest `confirmDate`s in the data are 2026‑09‑23, 08‑31, 08‑18, … — new games arrive in bursts, days or weeks apart), but `seenCount`/`runCount`/`like` drift constantly and drive the sort options. Ten minutes keeps those fresh enough and shields the upstream API from per-visitor traffic. The same value applies to the proxy route's upstream calls.

## Design decisions

### Load more vs. pagination (Req. 9)
**Load more.** Search, filters, sort and favorites are applied client-side over the loaded items. Numbered pages would make "page 3" mean different things as soon as a filter hides some rows, and would force URL state for the page number that can't be restored consistently. Load more keeps one growing list, one scroll position and a shareable URL independent of how many items were loaded. Cost: very long lists; fine at 726 items (virtualisation is listed under limitations).

### URL as source of truth (Req. 7)
`q`, `sort`, `fav`, and one parameter per filter id (`vendor`, `category`, `score`, `like`) live in the query string. `useUrlState` reads via `useSearchParams` and writes with the native History API, which Next.js syncs with its router (so back/forward and shared links work, and no server round trip is triggered). Details:
- Values equal to the default are removed, keeping URLs clean.
- Writes in the same tick are merged into **one** history entry (`lib/url-writer.ts`), so "clear all filters" is a single back-button step.
- Discrete changes (filters, sort, favorites-only) `push`; typing and the sliders `replace`, to avoid flooding history.
- The server page parses the same `searchParams` with the same `parseFilterState`, so a shared `?q=…` link server-renders the right first page.
- The search input keeps a local draft; it is re-synced from the URL on back/forward or "clear", and written to the URL 300 ms after typing stops.
- Deviation from the suggested signature: `useUrlState<T>(key, defaultValue, codec, options?)` takes a codec so that parsing needs no type assertions.

### Search & Persian normalisation (Req. 2–3)
`normalizePersian` (`lib/normalize-persian.ts`) applies NFKC, ي/ى→ی, ك→ک, Persian/Arabic-Indic digits→Latin, removes ZWNJ/ZWJ/LRM/RLM/ZWSP, strips Arabic diacritics and tatweel, lowercases, collapses whitespace and trims. It is applied to **both** the query and the searched text (`title + companyName`, cached per game in a `WeakMap`), and every query token must match.

Search is a hybrid, because filtering only the 12 loaded games would make search useless on a 726-game catalogue: the normalised query is sent through the proxy to the upstream search endpoint to **widen the pool**, then the spec'd client-side normalised matching on title/company is applied on top. Caveat: the upstream doesn't normalise, so a title stored with Persian digits will not be found by typing Latin digits (we send the normalised query).

### Filters (Req. 4, Task 6.3)
`lib/filters/config.ts` is the only place that defines filters (vendor, category, minimum score). The UI, URL parsing, and `filterGames` all iterate it. **Unrequested filter added to demonstrate this:** "minimum likes" (`like`), a ~10-line entry in that one file. Within a filter values are OR-ed, across filters AND-ed. Category options come from loaded games, and values restored from a URL stay visible even if not loaded yet.

### Empty vendor arrays (Task 8.3)
**Separate "نامشخص" (unspecified) bucket.** 95% of games have no vendor data, so *excluding* them makes the vendor filter hide almost everything, and *including* them always makes the filter meaningless (selecting "rubika" would still show games with no known vendor). A distinct bucket is honest: users can pick "rubika", "soroush", or "unspecified" and always get exactly what the label says. Missing and empty arrays are treated identically.

### Quality score (Task 8.2)
`quality = 100 × (0.5·score/5 + 0.3·min(rating/1.5, 1) + 0.2·ln(1+like)/ln(1+25))`. Signals are scaled to 0–1 first. Missing signals are 0, so `score = 0` with a real `rating`/likes still outranks an empty game (620 of 726 games have `score = 0`). Likes are log-scaled (max 23, median 0); the rating cap absorbs outliers (p95 1.08, max 3.05). `level` is intentionally not used (it isn't a quality signal). Shown on each card and available as the default "quality" sort.

### `total` vs. `eachPerPage` (Task 8.4)
Findings: the plain `/games` endpoint is consistent (12 per page, last page 6, total 726), but a request with `eachPerPage > 100` silently returns 100, and the **search endpoint returns up to 2× `eachPerPage`** (e.g. `eachPerPage=10` → 20 games, `total=171`) because it merges web and console games per page. So `lib/pagination.ts` never trusts arithmetic: "has more" means *the last page contributed at least one unseen game* **and** fewer than `total` games are loaded. Duplicates are dropped by id; an empty page ends pagination. Covered by unit tests.

### Race-safe async (Task 6.4)
`hooks/use-game-feed.ts` uses **`AbortController`** (not a request-id): a query change aborts the in-flight first-page request so the network work is cancelled and its result can never be applied. "Load more" responses are applied through a functional update that checks the feed still belongs to the query it was requested for (the request-ID idea, derived from state rather than a counter), and are aborted when the feed is replaced. No `setTimeout` workarounds. The only timer is the debounce itself.

### Images (Task 8.1)
`lib/image-url.ts` resolves relative paths against `https://dl.lifelands.ir/`. `next/image` has explicit `width`/`height`, `sizes`, `remotePatterns` restricted to that host's `/game/**`; the first 4 cards load eagerly with high fetch priority, the rest lazily. On failure `GameImage` swaps in a same-sized fallback (icon + text), not a hidden `<img>`. A ref callback also detects images that failed *before* hydration (where `onError` would never fire).

### Favorites & performance (Req. 6, 9)
`useFavorites` uses `useSyncExternalStore` over `localStorage` (hydration-safe: server snapshot is empty; syncs across tabs; falls back to memory if storage is blocked). The visible list is memoised on `[games, filterState, favorites]`, but favorites are only passed in while "favorites only" is on, so toggling a heart in normal browsing doesn't recompute the list; cards are `memo`-ised with a stable `onToggle`, so only the toggled card re-renders. There are no scroll/resize handlers (layout is CSS only), so nothing needs throttling.

### Accessibility
Native controls where possible (`select`, `checkbox`, `range`, `button aria-pressed`); the dropdown filters use `aria-expanded/aria-controls`, close on **Escape** (returning focus to the trigger), on outside click and on focus leaving; a global `:focus-visible` ring; labelled inputs; a polite live region for result counts; `prefers-reduced-motion` disables shimmer and transitions; dark mode via `prefers-color-scheme` with token-based colours.

## TypeScript decisions

- **5.1 Envelope** – `ApiEnvelope<TData>` and `ApiPage<TItem>` (`lib/types/api.ts`); `fetchGamesPage` returns a typed `GamesPage` of lean `Game`s. Only consumed fields are typed, optional where the API varies.
- **5.2 Vendor union** – `VENDORS = ['soroush','rubika'] as const`, `Vendor`, and `isVendor(value: string): value is Vendor`. A plain `string[]` would let typos (`'rubka'`) compile, wouldn't force `VENDOR_LABELS: Record<Vendor, string>` to be updated when a vendor is added, and would let unknown upstream values flow into filters and labels. The mapper narrows with the guard at the boundary; unknown vendors are dropped.
- **5.3 Discriminated filter state** – `FilterState = BrowseFilterState | SearchFilterState` discriminated on `mode`. `sort: 'relevance'` exists only with a query and `'default'` only without; `query` cannot exist in browse mode. `lib/filters/state.test.ts` uses `@ts-expect-error` to prove the compiler rejects each invalid combination (the file fails `tsc` if any of them ever compiles). `createFilterState` coerces untrusted URL input into a valid member.
- **5.4 Mapped sort keys** – `NumericKeys<T>` maps over `Game`; `SortKey = NumericKeys<Game>`; `sortGames(games, key: SortKey)` rejects `'title'` or unknown keys (also asserted with `@ts-expect-error`). UI options are `satisfies`-checked against `SortKey`.
- No `any`, `@ts-ignore`, or `as unknown as` anywhere. `verbatimModuleSyntax` is on.

## Tests

`npm test` runs 44 tests across 13 suites with the Node test runner (Node strips TypeScript types natively; `lib/` therefore uses relative imports with `.ts` extensions). Beyond the required 3 `normalizePersian` and 2 `filterGames` tests there are tests for every other pure module in `lib/`.

## Trade-offs & known limitations

- Filters, sort and favorites-only work over the **loaded** games. A rare category may show few results until more pages load; the empty state offers "load more" and "clear filters", and the summary line shows "N of total loaded".
- Sorting is client-side, so "sort by likes" ranks loaded games, not the whole catalogue (the API exposes no sort parameter).
- With `?fav=1` in the URL the server render shows the empty state until `localStorage` is read on the client (favorites are not available on the server).
- Search sends the normalised query upstream, so Latin-vs-Persian digit matches depend on how the title is stored upstream.
- No virtualisation; fine for 726 items, would matter beyond a few hundred rendered cards.
- Not done: Lighthouse score, screen recording, haptic/sound feedback. **I could not run the app in a real browser in this environment**, so interactive behaviour (dropdown focus, back/forward, hydration) was validated by types, lint, build, unit tests, and HTTP checks of the server-rendered output and proxy — not by manual clicking. Please do a manual pass before relying on it.
- With more time: Playwright tests for URL/back-forward and keyboard flows, optimistic cross-page search caching, a Lighthouse CI budget.

## AI usage

**Tool used:** Claude Code (Claude Sonnet 5.5), run in the terminal, as the primary implementation tool. No other AI tools were used.

**What AI did.** Claude Code wrote most of the implementation code: the components, hooks, the pure data layer in `lib/`, the unit tests, the configuration and this documentation. It also sped up the investigation work: probing the live API with `curl` and small scripts, enumerating edge cases in the data, and keeping types and naming consistent across the codebase.

**What I did.** I set the direction and made the engineering decisions, and the AI implemented them. Concretely:
- Defined the overall architecture and the Server/Client Component separation, with the initial fetch on the server and interactivity only in leaf client components.
- Set the engineering priorities and approach: a pure, testable data layer, config-driven filters, and race-safe async handling.
- Decided how URL state, search, filters, load-more, favorites and Persian normalization should behave.
- Chose the key approaches for race conditions (`AbortController` plus a query guard), caching (the revalidation window) and performance (memoisation, per-card re-rendering).
- Resolved the search problem. The first page holds only 12 of 726 games, so client-side search over the loaded items alone could not find most of the catalogue. I went to the live Lifelands site, found the search API it uses (`/post/search/engine`), and gave it to the AI. The AI inspected it, and we combined it with client-side normalized matching on title and company, as the assignment requires. I also reviewed how the two interact.
- Chose the Node built-in test runner, selected which bonus items to include (dark mode, error boundary with retry, extra unit tests, Persian font), and handled deployment myself.
- Reviewed the generated code, gave feedback, refined solutions, and decided which trade-offs and extra features were appropriate.

**How the output was refined.** The AI's first approaches were reviewed and corrected during development. Examples already described above:
- **API behaviour:** an initial assumption that `?page=` paginates was disproved by probing the API; the real parameters are `pageId` and `eachPerPage`. Investigating the search endpoint also revealed that it returns up to twice `eachPerPage` items, which led to the "has more" logic in `lib/pagination.ts` (Task 8.4).
- **URL state:** per-key `router.replace` calls race when several parameters change at once, so writes now go through the native History API and are batched into a single history entry.
- **Async handling:** an early feed design aborted "load more" requests on every query change, which could leave the button stuck loading after an A → B → A query sequence. It now relies on a query guard and aborts only when the feed is actually replaced.
- **Search input sync:** syncing the input from the URL via an effect was replaced with the render-phase derived-state pattern to avoid cascading renders and overwriting what the user is typing.
- **Rejected:** extra libraries for debounce, URL state or testing; a route-level `loading.tsx` (it would hide the static header); untyped `res.json()` consumers.

**Testing.** The project has 44 unit tests (Node test runner), and `npm run lint`, `npm run typecheck` and `npm run build` pass. The compile-time type guarantees in Tasks 5.3 and 5.4 are asserted with `@ts-expect-error`, so type-checking fails if an invalid combination ever compiles.

**Assessment.** AI was most useful for implementation speed, API investigation, edge-case coverage and consistency across files. Its output still needs engineering judgment: several of its first approaches needed correction, and choices such as the hybrid upstream-plus-client search, the quality-score weights and the revalidation window are heuristics grounded in the sampled data and had to be reviewed and accepted deliberately.
