import { useContext, useEffect, useState } from "react";
import type { OmdbMovieDetails } from "../models/omdb";
import { getMovieById } from "../services/omdb";
import { Context } from "../context/Provider";

export const useMovieDetails = (id: string) => {
  const [data, setData] = useState<OmdbMovieDetails>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const ctx = useContext(Context);
  if (!ctx) {
    throw new Error("useFavorites must be used within a Context.Provider");
  }

  const { fav, setFav } = ctx;

  const toggleFav = (movie: OmdbMovieDetails) => {
    const exists = fav.some((favMovie) => favMovie.imdbID === movie.imdbID);
    if (exists) {
      setFav(fav.filter((favMovie) => favMovie.imdbID !== movie.imdbID));
    } else {
      setFav([...fav, movie]);
    }
  };

  const isFav = (id: string) => {
    return fav.some((favMovie) => favMovie.imdbID === id);
  };

  useEffect(() => {
    if (!id) return;
    getMovieById(id)
      .then((data) => setData(data))
      .catch((error) => {
        setError(error.message);
        return undefined;
      })
      .finally(() => setLoading(false));
  }, [id]);

  return { data, error, loading, toggleFav, isFav };
};
