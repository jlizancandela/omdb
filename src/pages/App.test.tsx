import { vi } from "vitest";
import * as useMoviesImport from "../hooks/useMovies.tsx";
import * as useFavoritesImport from "../hooks/useFavorites.tsx";
import type { OmdbSearchResult } from "../models/omdb.ts";
import { render } from "@testing-library/react";
import App from "./App.tsx";
import { Context } from "../context/Provider.tsx";
import { MemoryRouter } from "react-router";

vi.mock("../hooks/useMovies.tsx");
vi.mock("../hooks/useFavorites.tsx");

describe("App", () => {
  const useMovies = vi.mocked(useMoviesImport.useMovies);
  const useFavorites = vi.mocked(useFavoritesImport.useFavorites);

  const movies: OmdbSearchResult = {
    Search: [
      {
        Title: "Test Movie",
        Year: "2022",
        imdbID: "tt1234567",
        Type: "movie",
        Poster: "https://example.com/poster.jpg",
      },
    ],
    totalResults: "1",
    Response: "True",
  };

  useMovies.mockReturnValue({
    setSearch: vi.fn(),
    data: movies,
    lastid: vi.fn(),
  });

  useFavorites.mockReturnValue({
    fav: [],
    toggleFav: vi.fn(),
    isFav: vi.fn().mockReturnValue(false),
  });

  const wrapper = ({ children }: any) => (
    <Context.Provider
      value={{ fav: [], setFav: vi.fn(), lastPage: "", setLastpage: vi.fn() }}
    >
      <MemoryRouter>{children}</MemoryRouter>
    </Context.Provider>
  );

  beforeEach(() => {
    useMovies.mockClear(); // limpia los mocks antes de cada test
    useFavorites.mockClear(); // limpia los mocks antes de cada test
  });

  test("should render App component", () => {
    const { getByText } = render(<App />, { wrapper });
    expect(getByText("Proyecto OMDB")).toBeInTheDocument();
  });

  test("should render Test Movie", () => {
    const { getByText } = render(<App />, { wrapper });
    expect(getByText("Test Movie")).toBeInTheDocument();
  });
});
