import { type OmdbMovieShort as Movie } from "../models/omdb";
import { MovieCard } from "./MovieCard";
import styles from "./Movies.module.css";

interface Props {
  movies: Movie[];
  lastMovieRef: (node: HTMLDivElement | null) => void;
}

export function Movies({ movies, lastMovieRef }: Props) {
  if (movies.length === 0) {
    return <p>No se encontraron películas</p>;
  }

  return (
    <section className={styles.Peliculas}>
      {movies.map((movie, index) => (
        <MovieCard
          movie={movie}
          key={movie.imdbID}
          ref={movies.length === index + 1 ? lastMovieRef : undefined}
        />
      ))}
    </section>
  );
}
