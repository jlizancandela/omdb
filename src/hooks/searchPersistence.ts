import type { OmdbSearchResult } from "../models/omdb";

const STORAGE_KEY = "omdb-search-state";
const STORAGE_VERSION = 1;
const TTL_MS = 15 * 60 * 1000;
const MAX_PAGES = 5;
const MAX_STORAGE_BYTES = 500_000;

type PersistedSearchState = {
  version: number;
  query: string;
  savedAt: number;
  page: number;
  cache: Record<string, OmdbSearchResult>;
  data: OmdbSearchResult | null;
};

const readStoredSearchState = () => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const state = JSON.parse(raw) as PersistedSearchState;
    if (
      state.version !== STORAGE_VERSION ||
      !state.query ||
      Date.now() - state.savedAt > TTL_MS
    ) {
      sessionStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return state;
  } catch {
    sessionStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

export const readSearchState = (query: string) => {
  if (!query) return null;

  const state = readStoredSearchState();
  return state?.query === query ? state : null;
};

export const readLatestSearchState = () => readStoredSearchState();

export const writeSearchState = (
  query: string,
  page: number,
  cache: Record<string, OmdbSearchResult>,
  data: OmdbSearchResult | null
) => {
  if (!query || !data) return;

  const pages = Object.entries(cache)
    .filter(([key]) => key.startsWith(`${query}-`))
    .sort(([left], [right]) => {
      const leftPage = Number(left.slice(query.length + 1));
      const rightPage = Number(right.slice(query.length + 1));
      return rightPage - leftPage;
    })
    .slice(0, MAX_PAGES);

  const state: PersistedSearchState = {
    version: STORAGE_VERSION,
    query,
    savedAt: Date.now(),
    page,
    cache: Object.fromEntries(pages),
    data,
  };

  try {
    const serialized = JSON.stringify(state);
    if (serialized.length <= MAX_STORAGE_BYTES) {
      sessionStorage.setItem(STORAGE_KEY, serialized);
    }
  } catch {
    // Storage can be unavailable or full; search still works in memory.
  }
};

export const clearSearchState = () => {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage can be unavailable; there is no persisted state to clear.
  }
};
