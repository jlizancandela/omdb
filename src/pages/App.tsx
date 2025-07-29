import { useParams } from "react-router";
import { Movies } from "../components/Movies";
import { Search } from "../components/Search";
import { useMovies } from "../hooks/useMovies";

function App() {
  const { movie } = useParams<{ movie: string }>();
  const { setSearch, data, lastid } = useMovies(movie ? movie : "");

  return (
    <>
      <h1>Proyecto OMDB</h1>
      <Search setSearch={setSearch} />
      {data && <Movies movies={data.Search ?? []} lastMovieRef={lastid} />}
    </>
  );
}

export default App;
