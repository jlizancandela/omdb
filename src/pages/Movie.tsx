import { useNavigate, useParams } from "react-router";
import { useMovieDetails } from "../hooks/useMovieDetails";
import styles from "./Movie.module.css";
import { useContext } from "react";
import { Context } from "../context/Provider";
import { toShortMovie } from "../services/omdb";

export const Movie = () => {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error, isFav, toggleFav } = useMovieDetails(id || "");
  const ctx = useContext(Context);
  if (!ctx) {
    throw new Error("context must be used within a Context.Provider");
  }

  const { lastPage } = ctx;

  const navigate = useNavigate();

  const handledGoBack = () => {
    if (lastPage === "") {
      navigate("/favorites");
      return;
    }

    navigate(`/search/${lastPage}`);
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
        <button onClick={handledGoBack}>Go back</button>
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
          <button onClick={() => toggleFav(toShortMovie(data))}>
            {isFav(id || "") ? "dislike" : "like"}
          </button>
        </div>
      </div>
    );
};
