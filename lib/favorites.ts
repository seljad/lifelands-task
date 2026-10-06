export function parseFavorites(raw: string | null): Set<string> {
  if (raw === null) return new Set();
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((id): id is string => typeof id === "string"));
  } catch {
    return new Set();
  }
}

export function serializeFavorites(favorites: ReadonlySet<string>): string {
  return JSON.stringify([...favorites]);
}

export function toggleFavorite(
  favorites: ReadonlySet<string>,
  id: string,
): Set<string> {
  const next = new Set(favorites);
  if (!next.delete(id)) next.add(id);
  return next;
}
