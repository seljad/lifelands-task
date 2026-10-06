import { IMAGE_BASE_URL } from "./config.ts";

const ABSOLUTE_URL = /^https?:\/\//i;

export function resolveImageUrl(path: string): string {
  const trimmed = path.trim();
  if (ABSOLUTE_URL.test(trimmed)) return trimmed;
  return new URL(trimmed.replace(/^\/+/, ""), IMAGE_BASE_URL).toString();
}
