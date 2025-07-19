import { type OmdbMovieShort as Movie } from "../models/omdb";
import styles from "./MovieCard.module.css";
import { useNavigate } from "react-router";

const FALLBACK_POSTER_URL = "https://placehold.co/300x444?text=Movie\nPoster";
interface Props {
  movie: Movie;
}

export function MovieCard({ movie }: Props) {
  const navigate = useNavigate();

  return (
    <article className={styles.Pelicula}>
      <img
        src={movie.Poster === "N/A" ? FALLBACK_POSTER_URL : movie.Poster}
        alt={movie.Title}
        onError={(e) => {
          e.currentTarget.src = FALLBACK_POSTER_URL;
        }}
        onClick={() => {
          navigate(`/movie/${movie.imdbID}`);
        }}
      />
      <section>
        <h2>{movie.Title}</h2>
        <p>{movie.Year}</p>
      </section>
    </article>
  );
}
