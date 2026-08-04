import { Movies } from "../components/Movies";
import { useFavorites } from "../hooks/useFavorites";
import styles from "./Favorites.module.css";

export const Favorites = () => {
  const { fav } = useFavorites();

  return (
    <div className={styles.page}>
      <header>
        <h1>Favorites</h1>
        <p>Titles you chose to keep close.</p>
      </header>
      <Movies movies={fav} emptyMessage="Your favorites list is empty. Save a movie to see it here." />
    </div>
  );
};
