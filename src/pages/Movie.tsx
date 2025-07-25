import { useParams } from "react-router";
import { useMovieDetails } from "../hooks/useMovieDetails";
import styles from "./Movie.module.css";

export const Movie = () => {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error, isFav, toggleFav } = useMovieDetails(id || "");

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
          <button onClick={() => toggleFav(data)}>
            {isFav(id || "") ? "dislike" : "like"}
          </button>
        </div>
      </div>
    );
};
