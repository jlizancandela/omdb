import { useContext, useEffect, useRef, useState } from "react";
import { type OmdbSearchResult } from "../models/omdb";
import { useDebouncedValue } from "./useDebouncedValue";
import { useIntersectionObserver } from "./useIntersectionObserver";
import {
  filtrarPeliculasUnicas,
  getMovies,
  getOmdbErrorMessage,
  hasMore,
  isOmdbServiceError,
  OmdbServiceError,
} from "../services/omdb";
import { Context } from "../context/Provider";
import {
  clearSearchState,
  readSearchState,
  writeSearchState,
} from "./searchPersistence";

const isServiceError = (error: unknown): error is OmdbServiceError =>
  typeof error === "object" &&
  error !== null &&
  "kind" in error &&
  "message" in error;

export const useMovies = (movie = "") => {
  const restored = readSearchState(movie);
  const [data, setData] = useState<OmdbSearchResult | null>(
    restored?.data ?? null
  );
  const [pelicula, setPelicula] = useState(movie);
  const [cache, setCache] = useState<Record<string, OmdbSearchResult>>(
    restored?.cache ?? {}
  );
  const cacheRef = useRef(cache);
  const [page, setPage] = useState(restored?.page ?? 1);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(movie);
  const debounceSearch = useDebouncedValue(search, 500);
  const [error, setError] = useState<OmdbServiceError | null>(null);
  const [paginationError, setPaginationError] = useState<OmdbServiceError | null>(null);
  const [retry, setRetry] = useState(0);
  const initialized = useRef(false);
  const hasLoadedForCurrentIntersection = useRef(false);

  const ctx = useContext(Context);
  if (!ctx) {
    throw new Error("context must be used within a Context.Provider");
  }
  const { setLastpage } = ctx;

  useEffect(() => {
    cacheRef.current = cache;
  }, [cache]);

  useEffect(() => {
    setPelicula(movie);
    setSearch(movie);
    setLastpage(movie);
  }, [movie, setLastpage]);

  useEffect(() => {
    if (debounceSearch.length < 3) return;
    setPelicula(debounceSearch);
    setLastpage(debounceSearch);
  }, [debounceSearch, setLastpage]);

  const lastid = useIntersectionObserver((entry) => {
    if (!entry.isIntersecting) {
      hasLoadedForCurrentIntersection.current = false;
      return;
    }

    if (!loading && hasMore(data) && !hasLoadedForCurrentIntersection.current) {
      hasLoadedForCurrentIntersection.current = true;
      setPage((prev) => prev + 1);
    }
  });

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      return;
    }
    hasLoadedForCurrentIntersection.current = false;
    setData(null); // Limpia resultados anteriores
    setPage(1); // Reinicia la paginación
  }, [pelicula]);

  useEffect(() => {
    if (!pelicula) return;
    const clave = `${pelicula}-${page}`;

    if (cacheRef.current[clave]) {
      setError(null);
      setPaginationError(null);
      const dataCache = cacheRef.current[clave];
      setData((prev) => {
        if (!prev || page === 1)
          return {
            ...dataCache,
            Search: dataCache.Search
              ? filtrarPeliculasUnicas([], dataCache.Search)
              : [],
          };

        return {
          ...dataCache,
          Search: [
            ...prev.Search,
            ...(dataCache.Search
              ? filtrarPeliculasUnicas(prev.Search, dataCache.Search)
              : []),
          ],
        };
      });
      return;
    }

    const controller = new AbortController();
    let active = true;
    setLoading(true);
    if (page === 1) setError(null);
    else setPaginationError(null);

    getMovies(pelicula, page, controller.signal)
      .then((data) => {
        if (!active) return;
        if (data) {
          setCache((prev) => ({
            ...prev,
            [clave]: data,
          }));

          setData((prev) => {
            if (!prev || page === 1)
              return {
                ...data,
                Search: data.Search
                  ? filtrarPeliculasUnicas([], data.Search)
                  : [],
              };

            return {
              ...data,
              Search: [
                ...prev.Search,
                ...(data.Search
                  ? filtrarPeliculasUnicas(prev.Search, data.Search)
                  : []),
              ],
            };
          });
        }
      })
      .catch((error: unknown) => {
        if (!active || (isOmdbServiceError(error) && error.kind === "cancelled")) return;
        const serviceError = isOmdbServiceError(error) || isServiceError(error)
          ? error as OmdbServiceError
          : new OmdbServiceError("network", "No se pudo acceder al servicio de OMDb.");
        if (page === 1) setError(serviceError);
        else setPaginationError(serviceError);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [pelicula, page, retry]);

  useEffect(() => {
    writeSearchState(pelicula, page, cache, data);
  }, [cache, data, page, pelicula]);

  const handleSearch = (value: string) => {
    if (value === "") {
      setSearch("");
      setPelicula("");
      setLastpage("");
      setData(null);
      setPage(1);
      setCache({});
      hasLoadedForCurrentIntersection.current = false;
      clearSearchState();
      setError(null);
      setPaginationError(null);
      return;
    }

    setSearch(value);
    setError(null);
    setPaginationError(null);
    if (value.length < 3) {
      setPelicula("");
      setData(null);
      setPage(1);
      hasLoadedForCurrentIntersection.current = false;
      return;
    }
  };

  return {
    data,
    setSearch: handleSearch,
    loading,
    lastid,
    error,
    paginationError,
    retry: () => setRetry((value) => value + 1),
    errorMessage: error ? getOmdbErrorMessage(error) : null,
    paginationErrorMessage: paginationError ? getOmdbErrorMessage(paginationError) : null,
    search,
  };
};
