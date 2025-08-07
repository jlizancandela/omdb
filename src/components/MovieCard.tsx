import { type OmdbMovieShort as Movie } from "../models/omdb";
import styles from "./MovieCard.module.css";
import { useNavigate } from "react-router";
import { useFavorites } from "../hooks/useFavorites";
import image from "../assets/placeHolder.png";
import { forwardRef, type Ref } from "react";

interface Props {
  movie: Movie;
}

export const MovieCard = forwardRef<HTMLDivElement, Props>(
  ({ movie }, ref: Ref<HTMLDivElement>) => {
    const { isFav, toggleFav } = useFavorites();
    const navigate = useNavigate();
    const handleMovieClick = (id: string) => {
      navigate(`/movie/${id}`);
    };

    return (
      <article
        className={`${styles.Pelicula}`}
        ref={ref}
        data-aos="fade-up"
        data-aos-duration="1000"
        data-aos-easing="ease-in-out"
      >
        <img
          src={movie.Poster === "N/A" ? image : movie.Poster}
          alt={movie.Title}
          onError={(e) => {
            e.currentTarget.src = image;
          }}
          onClick={() => {
            handleMovieClick(movie.imdbID);
          }}
        />
        <section>
          <h2>{movie.Title}</h2>
          <p>{movie.Year}</p>
          <button
            className={`${styles.favoriteButton} ${
              isFav(movie.imdbID) ? styles.fav : styles.notFav
            }`}
            onClick={() => toggleFav(movie)}
            aria-label={
              isFav(movie.imdbID)
                ? "Remove from favorites"
                : "Add to favorites"
            }
          >
            {isFav(movie.imdbID) ? "♥" : "♡"}
          </button>
        </section>
      </article>
    );
  }
);
