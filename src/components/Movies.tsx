import { type OmdbMovieShort as Movie } from "../models/omdb";
import { MovieCard } from "./MovieCard";
import styles from "./Movies.module.css";

interface Props {
  movies: Movie[];
  sentinelRef?: (node: HTMLElement | null) => void;
  emptyMessage?: string;
}

export function Movies({
  movies,
  sentinelRef,
  emptyMessage = "No se encontraron películas para esa búsqueda.",
}: Props) {
  if (movies.length === 0) {
    return <p className={styles.empty} role="status">{emptyMessage}</p>;
  }

  return (
    <section className={styles.movies} aria-label="Resultados de películas">
      {movies.map((movie) => (
        <MovieCard
          movie={movie}
          key={movie.imdbID}
        />
      ))}
      <div ref={sentinelRef} className={styles.sentinel} aria-hidden="true" />
    </section>
  );
}
