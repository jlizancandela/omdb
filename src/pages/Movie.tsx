import { useParams } from "react-router";
import { useMovieDetails } from "../hooks/useMovieDetails";
import styles from "./Movie.module.css";
import { useContext } from "react";
import { Context } from "../context/Provider";
import { toShortMovie, type OmdbServiceError } from "../services/omdb";
import image from "../assets/placeHolder.png";

const getMovieErrorMessage = (error: OmdbServiceError): string => {
  if (error.kind === "api" && /not found/i.test(error.message)) {
    return "We couldn't find a movie with that IMDb ID.";
  }

  switch (error.kind) {
    case "api":
      return "OMDb couldn't load this movie. Check the IMDb ID and try again.";
    case "http":
      return "The movie service is temporarily unavailable. Try again shortly.";
    case "network":
      return "We couldn't connect to the movie service. Check your connection and try again.";
    case "invalid-payload":
      return "The movie service returned incomplete details. Try again shortly.";
    case "cancelled":
      return "The movie request was cancelled. Try again to load the details.";
  }
};

export const Movie = () => {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error, retry, isFav, toggleFav } = useMovieDetails(id || "");
  const ctx = useContext(Context);
  if (!ctx) {
    throw new Error("context must be used within a Context.Provider");
  }

  if (loading) {
    return <p className={styles.message} role="status">Loading movie details...</p>;
  }

  if (error) {
    return (
      <div className={styles.message} role="alert">
        <p>{getMovieErrorMessage(error)}</p>
        <button type="button" onClick={retry}>Try again</button>
      </div>
    );
  }

  if (data)
    return (
      <div className={styles.movieContainer}>
        <img
          src={data?.Poster == "N/A" ? image : data?.Poster}
          alt={`Poster for ${data.Title}`}
          onError={(e) => {
            e.currentTarget.src = image;
          }}
        />
        <div className={styles.movieDetails}>
          <div className={styles.headingRow}>
            <div>
              <p className={styles.type}>{data.Type} · {data.Year}</p>
              <h1>{data.Title}</h1>
            </div>
            <button
              className={`${styles.favoriteButton} ${isFav(id || "") ? styles.fav : styles.notFav}`}
              onClick={() => toggleFav(toShortMovie(data))}
              type="button"
              aria-pressed={isFav(id || "")}
              aria-label={isFav(id || "") ? "Remove from favorites" : "Add to favorites"}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" fill={isFav(id || "") ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                <path d="M20.8 8.7c0 5.3-8.8 10.1-8.8 10.1S3.2 14 3.2 8.7A4.7 4.7 0 0 1 12 6.3a4.7 4.7 0 0 1 8.8 2.4Z" />
              </svg>
            </button>
          </div>
          <p className={styles.plot}>{data.Plot}</p>
          <dl className={styles.facts}>
            <div><dt>Director</dt><dd>{data.Director}</dd></div>
            <div><dt>Actors</dt><dd>{data.Actors}</dd></div>
            <div><dt>Genre</dt><dd>{data.Genre}</dd></div>
            <div><dt>Runtime</dt><dd>{data.Runtime}</dd></div>
            <div><dt>IMDb rating</dt><dd>{data.imdbRating}</dd></div>
          </dl>
        </div>
      </div>
    );

  return <p className={styles.message} role="status">This movie is not available.</p>;
};
