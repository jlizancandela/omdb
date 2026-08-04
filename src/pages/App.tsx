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
          <h1>OMDb Movie Browser</h1>
          <p>Search titles, inspect the details, and keep a short list for later.</p>
        </div>
        <span className={styles.mode}>Operate mode</span>
      </header>
      <Search setSearch={handleSearch} value={search} />
      <section className={styles.results} aria-live="polite" aria-busy={loading}>
        {error != null && (
          <div className={styles.message} role="alert">
            <p>{errorMessage}</p>
            <button type="button" onClick={retry}>Try again</button>
          </div>
        )}
        {initialLoading && (
          <div className={styles.loading} role="status">
            <span className="srOnly">Loading movie results</span>
            <div className={styles.loadingBar} />
            <div className={styles.loadingGrid}><span /><span /><span /></div>
          </div>
        )}
        {!error && data && <Movies movies={data.Search ?? []} sentinelRef={lastid} />}
        {paginationError && data && (
          <div className={styles.message} role="alert">
            <p>{paginationErrorMessage}</p>
            <button type="button" onClick={retry}>Try again</button>
          </div>
        )}
        {loadingMore && (
          <div className={styles.loadingMore} role="status" aria-label="Loading more movies">
            <span className={styles.loadingMoreIndicator} aria-hidden="true" />
            <span>Loading more movies</span>
          </div>
        )}
        {!initialLoading && !loadingMore && !error && !data && <p className={styles.message}>Start with a title to browse movies.</p>}
      </section>
    </div>
  );
}

export default App;
