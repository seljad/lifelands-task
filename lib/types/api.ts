export type ApiEnvelope<TData> = {
  state: boolean;
  data: TData;
};

export type ApiPage<TItem> = {
  pageId: number;
  eachPerPage: number;
  searchValue: string;
  total: number;
  games: TItem[];
};

/**
 * Only the fields this app consumes, as observed on
 * GET /api/v1/games and GET /api/v1/post/search/engine (726 games inspected).
 * `companyName` is absent on some games and `vitrinThirdPartyVendors` is
 * absent on ~43% of them (and empty on another ~55%), so both are optional.
 */
export type RawGame = {
  _id: string;
  title: string;
  image: string;
  companyName?: string;
  category: { title: string };
  score: number;
  rating: number;
  like: number;
  seenCount: number;
  runCount: number;
  vitrinThirdPartyVendors?: string[];
};

export type RawGamesResponse = ApiEnvelope<ApiPage<RawGame>>;
