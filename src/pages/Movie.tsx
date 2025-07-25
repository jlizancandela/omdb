import { useParams } from "react-router";
import { useMovieDetails } from "../hooks/useMovieDetails";
import styles from "./Movie.module.css";
import { useContext } from "react";
import { Context } from "../context/Provider";
import type { OmdbMovieDetails } from "../models/omdb";

export const Movie = () => {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useMovieDetails(id || ""); // TODO: Añadir el estado de like

  const ctx = useContext(Context);
  if (!ctx) return null; // protección si está fuera del Provider

  const { lastPage, fav, setFav, setLastpage } = ctx;

  //TODO: Exportar la función
  const addFav = (data: OmdbMovieDetails) => {
    const exists = fav.some((movie) => movie.imdbID === id);
    if (!exists) {
      setFav([...fav, data]);
    } else {
      setFav(fav.filter((movie) => movie.imdbID !== id));
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Something went wrong...</p>;
  }

  if (data)
    return (
      <div className={styles.movieContainer}>
        <img src={data?.Poster} alt={data?.Title} />
        <div className={styles.movieDetails}>
          <h1>{data?.Title}</h1>
          <p>{data?.Plot}</p>
          <p>Year: {data?.Year}</p>
          <p>Director: {data?.Director}</p>
          <p>Actors: {data?.Actors}</p>
          <p>Genre: {data?.Genre}</p>
          <p>Runtime: {data?.Runtime}</p>
          <p>IMDB Rating: {data?.imdbRating}</p>
          <button onClick={() => addFav(data)}>like</button> // TODO: Crear un
          componente dinamico para el like
        </div>
      </div>
    );
};
