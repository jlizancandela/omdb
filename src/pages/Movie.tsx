import { useParams } from "react-router";
import { useMovieDetails } from "../hooks/useMovieDetails";
import styles from "./Movie.module.css";
import { useContext } from "react";
import { Context } from "../context/Provider";
import { toShortMovie } from "../services/omdb";
import image from "../assets/placeHolder.png";

export const Movie = () => {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error, isFav, toggleFav } = useMovieDetails(id || "");
  const ctx = useContext(Context);
  if (!ctx) {
    throw new Error("context must be used within a Context.Provider");
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Something went wrong...</p>;
  }

  console.log(data);

  if (data)
    return (
      <div className={styles.movieContainer}>
        <img
          src={data?.Poster == "N/A" ? image : data?.Poster}
          alt={data?.Title}
          onError={(e) => {
            e.currentTarget.src = image;
          }}
        />
        <div className={styles.movieDetails}>
          <h1>{data?.Title}</h1>
          <p>{data?.Plot}</p>
          <p>Year: {data?.Year}</p>
          <p>Director: {data?.Director}</p>
          <p>Actors: {data?.Actors}</p>
          <p>Genre: {data?.Genre}</p>
          <p>Runtime: {data?.Runtime}</p>
          <p>IMDB Rating: {data?.imdbRating}</p>
          <button
            className={`${styles.favoriteButton} ${
              isFav(id || "") ? styles.fav : styles.notFav
            }`}
            onClick={() => toggleFav(toShortMovie(data))}
            aria-label={
              isFav(id || "") ? "Remove from favorites" : "Add to favorites"
            }
          >
            {isFav(id || "") ? "♥" : "♡"}
          </button>
        </div>
      </div>
    );
};
