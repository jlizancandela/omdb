import { Movies } from "../components/Movies";
import { useFavorites } from "../hooks/useFavorites";

export const Favorites = () => {
  const { fav } = useFavorites();

  return (
    <>
      <h1>Favorites</h1>
      <Movies movies={fav} />
    </>
  );
};
