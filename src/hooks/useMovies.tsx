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

  const ctx = useContext(Context);
  if (!ctx) {
    throw new Error("context must be used within a Context.Provider");
  }
  const { setLastpage } = ctx;

  useEffect(() => {
    if (debounceSearch === "" || search === "") return;
    setPelicula(debounceSearch);
    setLastpage(debounceSearch);

    const newPath = `/search/${debounceSearch}`;
    if (window.location.pathname !== newPath) {
      window.history.replaceState(null, "", newPath);
    }
  }, [debounceSearch]);

  const lastid = useIntersectionObserver(() => {
    if (!loading && hasMore(data)) {
      setPage((prev) => prev + 1);
    }
  });

  useEffect(() => {
    if (!pelicula) return;
    setData(null); // Limpia resultados anteriores
    setPage(1); // Reinicia la paginación
  }, [pelicula]);

  useEffect(() => {
    if (!pelicula) return;
    setLoading(true);
    getMovies(pelicula, page, cache)
      .then((data) => {
        if (data) {
          const clave = `${pelicula}-${page}`;
          if (!cache[clave]) {
            setCache((prev) => ({
              ...prev,
              [clave]: data,
            }));
          }

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
        console.error("Error en useEffect:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [pelicula, page]);

  return { data, setSearch, lastid };
};
