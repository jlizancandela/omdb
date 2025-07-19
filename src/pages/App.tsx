import { Movies } from "../components/Movies";
import { Search } from "../components/Search";
import { useMovies } from "../hooks/useMovies";

function App() {
  const { setSearch, data, lastid } = useMovies();

  return (
    <>
      <p>Proyecto OMDB</p>
      <Search setSearch={setSearch} />
      <Movies movies={data?.Search ?? []} lastMovieRef={lastid} />
    </>
  );
}

export default App;
