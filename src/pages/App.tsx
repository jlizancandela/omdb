import { useLocation, useNavigate, useParams, useSearchParams } from "react-router";
import { Movies } from "../components/Movies";
import { Search } from "../components/Search";
import { useMovies } from "../hooks/useMovies";
import { readLatestSearchState } from "../hooks/searchPersistence";
import styles from "./App.module.css";

function App() {
  const { movie } = useParams<{ movie: string }>();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const urlQuery = searchParams.get("q");
  const hasUrlQuery = urlQuery !== null || movie !== undefined;
  const query = hasUrlQuery
    ? urlQuery ?? movie ?? ""
    : location.pathname === "/"
      ? readLatestSearchState()?.query ?? ""
      : "";

  const {
    setSearch,
    data,
    lastid,
    loading,
    error,
    paginationError,
    retry,
    errorMessage,
    paginationErrorMessage,
    search,
  } = useMovies(query);
  const initialLoading = loading && !data;
  const loadingMore = loading && Boolean(data);

  const handleSearch = (value: string) => {
    setSearch(value);
    if (value === "") {
      navigate("/", { replace: true });
      return;
    }

    navigate(`/search?q=${encodeURIComponent(value)}`, { replace: true });
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1>Explorador de películas OMDb</h1>
          <p>Busca títulos, consulta los detalles y guarda una lista breve para después.</p>
        </div>
      </header>
      <Search setSearch={handleSearch} value={search} />
      <section className={styles.results} aria-live="polite" aria-busy={loading}>
        {error != null && (
          <div className={styles.message} role="alert">
            <p>{errorMessage}</p>
            <button type="button" onClick={retry}>Intentar de nuevo</button>
          </div>
        )}
        {initialLoading && (
          <div className={styles.loading} role="status">
            <span className="srOnly">Cargando resultados de películas</span>
            <div className={styles.loadingBar} />
            <div className={styles.loadingGrid}><span /><span /><span /></div>
          </div>
        )}
        {!error && data && <Movies movies={data.Search ?? []} sentinelRef={lastid} />}
        {paginationError && data && (
          <div className={styles.message} role="alert">
            <p>{paginationErrorMessage}</p>
            <button type="button" onClick={retry}>Intentar de nuevo</button>
          </div>
        )}
        {loadingMore && (
          <div className={styles.loadingMore} role="status" aria-label="Cargando más películas">
            <span className={styles.loadingMoreIndicator} aria-hidden="true" />
            <span>Cargando más películas</span>
          </div>
        )}
        {!initialLoading && !loadingMore && !error && !data && <p className={styles.message}>Comienza con un título para explorar películas.</p>}
      </section>
    </div>
  );
}

export default App;
