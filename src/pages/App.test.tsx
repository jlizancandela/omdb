import { vi } from "vitest";
import * as useMoviesImport from "../hooks/useMovies.tsx";
import * as useFavoritesImport from "../hooks/useFavorites.tsx";
import type { OmdbSearchResult } from "../models/omdb.ts";
import { fireEvent, render } from "@testing-library/react";
import App from "./App.tsx";
import { Context } from "../context/Provider.tsx";
import { MemoryRouter, useLocation } from "react-router";

vi.mock("../hooks/useMovies.tsx");
vi.mock("../hooks/useFavorites.tsx");

function LocationProbe() {
  const location = useLocation();
  return <output data-testid="location">{location.pathname}{location.search}</output>;
}

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

  useMovies.mockImplementation(() => ({
    setSearch: vi.fn(),
    data: movies,
    lastid: vi.fn(),
    search: new URLSearchParams(window.location.search).get("q") ?? "",
  }));

  useFavorites.mockReturnValue({
    fav: [],
    toggleFav: vi.fn(),
    isFav: vi.fn().mockReturnValue(false),
  });

  const wrapper = ({ children }: any) => (
    <Context.Provider
      value={{ fav: [], setFav: vi.fn(), lastPage: "", setLastpage: vi.fn() }}
    >
      <MemoryRouter
        initialEntries={[window.location.pathname + window.location.search]}
      >
        {children}
        <LocationProbe />
      </MemoryRouter>
    </Context.Provider>
  );

  beforeEach(() => {
    window.history.pushState({}, "", "/");
    useMovies.mockClear(); // limpia los mocks antes de cada test
    useFavorites.mockClear(); // limpia los mocks antes de cada test
  });

  test("should render App component", () => {
    const { getByText } = render(<App />, { wrapper });
    expect(getByText("OMDb Movie Browser")).toBeInTheDocument();
  });

  test("should render Test Movie", () => {
    const { getByText } = render(<App />, { wrapper });
    expect(getByText("Test Movie")).toBeInTheDocument();
  });

  test("keeps existing movies visible while loading more results", () => {
    useMovies.mockReturnValueOnce({
      setSearch: vi.fn(),
      data: movies,
      lastid: vi.fn(),
      loading: true,
      error: null,
      search: "",
    });

    const { getByText, getByRole } = render(<App />, { wrapper });

    expect(getByText("Test Movie")).toBeInTheDocument();
    expect(getByRole("status", { name: "Loading more movies" })).toBeInTheDocument();
  });

  test("hydrates the search input from the URL and clears it accessibly", () => {
    window.history.pushState({}, "", "/search?q=spider");
    const { getByRole, getByTestId } = render(<App />, { wrapper });
    const input = getByRole("textbox") as HTMLInputElement;

    expect(input.value).toBe("spider");
    expect(getByRole("button", { name: "Clear search" })).toBeInTheDocument();

    fireEvent.click(getByRole("button", { name: "Clear search" }));

    expect(getByTestId("location")).toHaveTextContent("/");
  });

  test("writes new searches to the shareable URL", () => {
    const { getByRole, getByTestId } = render(<App />, { wrapper });

    fireEvent.change(getByRole("textbox"), { target: { value: "spider" } });

    expect(getByTestId("location")).toHaveTextContent("/search?q=spider");
  });
});
