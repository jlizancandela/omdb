import { forwardRef, type Ref } from "react";
import { Link } from "react-router";
import { useFavorites } from "../hooks/useFavorites";
import type { OmdbMovieShort as Movie } from "../models/omdb";
import image from "../assets/placeHolder.png";
import styles from "./MovieCard.module.css";

interface Props { movie: Movie; }

export const MovieCard = forwardRef<HTMLElement, Props>(
  ({ movie }, ref: Ref<HTMLElement>) => {
    const { isFav, toggleFav } = useFavorites();
    const favorite = isFav(movie.imdbID);

    return (
      <article className={styles.movieCard} ref={ref}>
        <Link className={styles.posterLink} to={`/movie/${movie.imdbID}`}>
          <img
            src={movie.Poster === "N/A" ? image : movie.Poster}
            alt={`Cartel de ${movie.Title}`}
            onError={(event) => { event.currentTarget.src = image; }}
          />
        </Link>
        <div className={styles.cardContent}>
          <div>
            <Link className={styles.titleLink} to={`/movie/${movie.imdbID}`}>
              <h2>{movie.Title}</h2>
            </Link>
            <p className={styles.year}>{movie.Year}</p>
          </div>
          <button
            className={`${styles.favoriteButton} ${favorite ? styles.fav : styles.notFav}`}
            onClick={() => toggleFav(movie)}
            type="button"
            aria-pressed={favorite}
            aria-label={favorite ? "Quitar de favoritos" : "Añadir a favoritos"}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" fill={favorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
              <path d="M20.8 8.7c0 5.3-8.8 10.1-8.8 10.1S3.2 14 3.2 8.7A4.7 4.7 0 0 1 12 6.3a4.7 4.7 0 0 1 8.8 2.4Z" />
            </svg>
          </button>
        </div>
      </article>
    );
  }
);
