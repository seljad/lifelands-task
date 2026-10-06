import type { Vendor } from "../vendors.ts";

export type Game = {
  id: string;
  title: string;
  companyName: string;
  category: string;
  imageUrl: string;
  vendors: readonly Vendor[];
  score: number;
  rating: number;
  like: number;
  seenCount: number;
  runCount: number;
  quality: number;
};

export type GamesPage = {
  games: Game[];
  pageId: number;
  total: number;
};

export type GamesPageRequest = {
  pageId: number;
  query: string;
};
