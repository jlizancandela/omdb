import { Link, useLocation } from "react-router";
import styles from "./NavBar.module.css";
import { useContext } from "react";
import { Context } from "../context/Provider";
export const NavBar = () => {
  const location = useLocation();
  const ctx = useContext(Context);
  if (!ctx) return null;

  const { lastPage, setLastpage } = ctx;

  return (
    <nav className={styles.nav} aria-label="Primary navigation">
      <div className={styles.navInner}>
        <Link className={styles.brand} to="/" onClick={() => setLastpage("")}>
          <span className={styles.brandMark} aria-hidden="true">O</span>
          <span>OMDb</span>
        </Link>
        <ul>
        {lastPage !== "" && location.pathname.includes("/movie/") && (
          <li>
            <Link to={`/search/${lastPage}`} aria-label="Back to search results">
              <span aria-hidden="true">←</span> Back
            </Link>
          </li>
        )}
        <li>
          <Link
            to="/"
            onClick={() => setLastpage("")}
            className={location.pathname === "/" ? styles.active : undefined}
            aria-current={location.pathname === "/" ? "page" : undefined}
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/favorites"
            className={location.pathname === "/favorites" ? styles.active : undefined}
            aria-current={location.pathname === "/favorites" ? "page" : undefined}
          >Favorites</Link>
        </li>
        </ul>
      </div>
    </nav>
  );
};
