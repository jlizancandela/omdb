import { Movies } from "../components/Movies";
import { useFavorites } from "../hooks/useFavorites";
import styles from "./Favorites.module.css";

export const Favorites = () => {
  const { fav } = useFavorites();

  return (
    <div className={styles.page}>
      <header>
        <h1>Favoritos</h1>
        <p>Títulos que elegiste conservar.</p>
      </header>
      <Movies movies={fav} emptyMessage="Tu lista de favoritos está vacía. Guarda una película para verla aquí." />
    </div>
  );
};
