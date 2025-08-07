import { type OmdbMovieShort as Movie } from "../models/omdb";
import styles from "./MovieCard.module.css";
import { useNavigate } from "react-router";
import { useFavorites } from "../hooks/useFavorites";
import image from "../assets/placeHolder.png";

interface Props {
  movie: Movie;
  ref?: React.Ref<HTMLDivElement>;
}

export function MovieCard({ movie, ref }: Props) {
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
        <button onClick={() => toggleFav(movie)}>
          {isFav(movie.imdbID) ? "Remove from favorites" : "Add to favorites"}
        </button>
      </section>
    </article>
  );
}
