import { Link, useLocation } from "react-router";
import styles from "./NavBar.module.css";
import { useContext } from "react";
import { Context } from "../context/Provider";
export const NavBar = () => {
  const ctx = useContext(Context);
  if (!ctx) return null;

  const { lastPage, setLastpage } = ctx;
  const location = useLocation();

  return (
    <nav className={styles.nav} data-aos="fade-down" data-aos-duration="600">
      <ul>
        {lastPage !== "" && location.pathname.includes("/movie/") && (
          <li>
            <Link to={`/search/${lastPage}`}>Back</Link>
          </li>
        )}
        <li>
          <Link to="/" onClick={() => setLastpage("")}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/favorites">Favorites</Link>
        </li>
      </ul>
    </nav>
  );
};
