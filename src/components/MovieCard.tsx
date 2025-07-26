import { type OmdbMovieShort as Movie } from "../models/omdb";
import styles from "./MovieCard.module.css";
import { useNavigate } from "react-router";
import { useFavorites } from "../hooks/useFavorites";

const FALLBACK_POSTER_URL = "https://placehold.co/300x444?text=Movie\nPoster";
interface Props {
  movie: Movie;
  key: string;
  ref?: React.Ref<HTMLDivElement>;
}

export function MovieCard({ movie, ref }: Props) {
  const { isFav, toggleFav } = useFavorites();
  const navigate = useNavigate();
  const handleMovieClick = (id: string) => {
    navigate(`/movie/${id}`);
  };

  return (
    <article className={styles.Pelicula} ref={ref}>
      <img
        src={movie.Poster === "N/A" ? FALLBACK_POSTER_URL : movie.Poster}
        alt={movie.Title}
        onError={(e) => {
          e.currentTarget.src = FALLBACK_POSTER_URL;
        }}
        onClick={() => {
          handleMovieClick(movie.imdbID);
        }}
      />
      <section>
        <h2>{movie.Title}</h2>
        <p>{movie.Year}</p>
        <button onClick={() => toggleFav(movie)}>
          {isFav(movie.imdbID) ? "Remove from favorites" : "Add to favorites"}
        </button>
      </section>
    </article>
  );
}
