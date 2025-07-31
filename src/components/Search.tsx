import styles from "./Search.module.css";

interface Props {
  setSearch: (search: string) => void;
}

export function Search({ setSearch }: Props) {
  return (
    <form
      className={styles.Cuadro_busqueda}
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        type="text"
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search..."
      />
    </form>
  );
}
