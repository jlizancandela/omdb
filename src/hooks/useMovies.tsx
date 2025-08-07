import { useContext, useEffect, useState } from "react";
import { type OmdbSearchResult } from "../models/omdb";
import { useDebouncedValue } from "./useDebouncedValue";
import { useIntersectionObserver } from "./useIntersectionObserver";
import { filtrarPeliculasUnicas, getMovies, hasMore } from "../services/omdb";
import { Context } from "../context/Provider";

export const useMovies = (movie = "") => {
  const [data, setData] = useState<OmdbSearchResult | null>(null);
  const [pelicula, setPelicula] = useState(movie);
  const [cache, setCache] = useState<Record<string, OmdbSearchResult>>({});
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const debounceSearch = useDebouncedValue(search, 500);
  const [error, setError] = useState<string | null>(null);

  const ctx = useContext(Context);
  if (!ctx) {
    throw new Error("context must be used within a Context.Provider");
  }
  const { setLastpage } = ctx;

  useEffect(() => {
    setPelicula(movie);
    if (movie === "") {
      setSearch("");
      setLastpage("");
    }
  }, [movie]);

  useEffect(() => {
    if (debounceSearch === "" || search === "") return;
    setPelicula(debounceSearch);
    setLastpage(debounceSearch);
  }, [debounceSearch]);

  const lastid = useIntersectionObserver(() => {
    if (!loading && hasMore(data)) {
      setPage((prev) => prev + 1);
    }
  });

  useEffect(() => {
    setData(null); // Limpia resultados anteriores
    setPage(1); // Reinicia la paginación
  }, [pelicula]);

  useEffect(() => {
    if (!pelicula) return;
    const clave = `${pelicula}-${page}`;

    if (cache[clave]) {
      const dataCache = cache[clave];
      setData((prev) => {
        if (!prev || page === 1) return dataCache;

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

    setLoading(true);
    getMovies(pelicula, page)
      .then((data) => {
        if (data) {
          setCache((prev) => ({
            ...prev,
            [clave]: data,
          }));

          setData((prev) => {
            if (!prev || page === 1) return data;

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
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [pelicula, page]);

  const handleSearch = (value: string) => {
    if (value === "") {
      setSearch("");
      setPelicula("");
      setLastpage("");
      window.history.replaceState(null, "", "/");
      return;
    }
    if (value.length < 3) {
      return;
    }

    setSearch(value);
  };

  return {
    data,
    setSearch: handleSearch,
    loading,
    lastid,
    error,
    search,
  };
};
