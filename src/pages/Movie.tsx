import { useParams } from "react-router";
import { useMovieDetails } from "../hooks/useMovieDetails";

export const Movie = () => {
  const { id } = useParams<{ id: string }>();
  const { data } = useMovieDetails(id || "");

  return (
    <div>
      <h1>Movie</h1>
      {data && <p>{data.Title}</p>}
    </div>
  );
};
