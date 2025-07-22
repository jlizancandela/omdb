import { useParams } from "react-router";
import { useMovieDetails } from "../hooks/useMovieDetails";

export const Movie = () => {
  const { id } = useParams<{ id: string }>();
  const { data } = useMovieDetails(id || "");

  // TODO: Añadir detalles de la pelicula.
  return (
    <div>
      <h1>Movie</h1>
      <p>{data?.Title}</p>
    </div>
  );
};
