import { useContext } from "react";
import { Context } from "../context/Provider";
import type { OmdbMovieShort } from "../models/omdb";

export const useFavorites = () => {
  const ctx = useContext(Context);
  if (!ctx) {
    throw new Error("useFavorites must be used within a Context.Provider");
  }

  const { fav, setFav } = ctx;

  const toggleFav = (movie: OmdbMovieShort) => {
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

  return { fav, toggleFav, isFav };
};
