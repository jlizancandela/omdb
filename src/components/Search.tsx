import styles from "./Search.module.css";

interface Props {
  setSearch: (search: string) => void;
  value?: string;
}

export function Search({ setSearch, value = "" }: Props) {
  return (
    <form
      className={styles.searchForm}
      onSubmit={(e) => e.preventDefault()}
    >
      <label htmlFor="movie-search" className="srOnly">
        Search movies by title
      </label>
      <span className={styles.searchIcon} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="6" />
          <path d="m16 16 4 4" />
        </svg>
      </span>
      <input
        id="movie-search"
        type="text"
        value={value}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search movies by title..."
        autoComplete="off"
        />
      {value && (
        <button
          className={styles.clearButton}
          type="button"
          aria-label="Clear search"
          onClick={() => setSearch("")}
        >
          ×
        </button>
      )}
    </form>
  );
}
