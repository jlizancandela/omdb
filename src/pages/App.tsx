import { useParams } from "react-router";
import { Movies } from "../components/Movies";
import { Search } from "../components/Search";
import { useMovies } from "../hooks/useMovies";

function App() {
  const { movie } = useParams<{ movie: string }>();
  const { setSearch, data, lastid } = useMovies(movie ? movie : "");

  return (
    <>
      <p>Proyecto OMDB</p>
      <Search setSearch={setSearch} />
      <Movies movies={data?.Search ?? []} lastMovieRef={lastid} />
    </>
  );
}

export default App;
