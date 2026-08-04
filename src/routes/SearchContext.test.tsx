import { fireEvent, render } from "@testing-library/react";
import { vi } from "vitest";
import { Context } from "../context/Provider";
import * as useMovieDetailsImport from "../hooks/useMovieDetails";
import { writeSearchState } from "../hooks/searchPersistence";
import type { OmdbMovieDetails, OmdbSearchResult } from "../models/omdb";
import { Router } from "./Router";

vi.mock("../hooks/useMovieDetails");
vi.mock("../hooks/useIntersectionObserver", () => ({
  useIntersectionObserver: () => vi.fn(),
}));

const result: OmdbSearchResult = {
  Search: [
    {
      Title: "Test Movie",
      Year: "2022",
      imdbID: "tt1234567",
      Type: "movie",
      Poster: "poster.jpg",
    },
  ],
  totalResults: "1",
  Response: "True",
};

const movie: OmdbMovieDetails = {
  ...result.Search![0],
  Runtime: "120 min",
  Genre: "Drama",
  Director: "John Doe",
  Actors: "Actor 1",
  Plot: "A test movie",
  imdbRating: "8.5",
  imdbVotes: "100",
  Rated: "PG-13",
  Released: "2022-01-01",
  Language: "English",
  Country: "USA",
  Awards: "None",
  Metascore: "75",
  DVD: "2022-02-01",
  BoxOffice: "$1",
  Production: "Studio",
  Website: "https://example.com",
  Response: "True",
  Error: "",
  Ratings: [],
  Writer: "Writer",
};

describe("search context restoration", () => {
  const useMovieDetails = vi.mocked(useMovieDetailsImport.useMovieDetails);

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <Context value={{ fav: [], setFav: vi.fn(), lastPage: "", setLastpage: vi.fn() }}>
      {children}
    </Context>
  );

  beforeEach(() => {
    sessionStorage.clear();
    window.history.pushState({}, "", "/favorites");
    useMovieDetails.mockReturnValue({
      data: movie,
      loading: false,
      error: null,
      isFav: vi.fn().mockReturnValue(false),
      toggleFav: vi.fn(),
    });
  });

  test.each(["/favorites", "/movie/tt1234567"])(
    "restores the persisted search when returning from %s",
    (from) => {
      window.history.pushState({}, "", from);
      writeSearchState("spider", 2, { "spider-1": result, "spider-2": result }, result);

      const { getByRole, getByText } = render(<Router />, { wrapper });
      fireEvent.click(getByRole("link", { name: "Inicio" }));

      expect(getByRole("textbox")).toHaveValue("spider");
      expect(getByText("Test Movie")).toBeInTheDocument();
    }
  );

  test("clear removes the URL and persisted search context", () => {
    writeSearchState("spider", 1, { "spider-1": result }, result);
    window.history.pushState({}, "", "/");

    const { getByRole } = render(<Router />, { wrapper });
    fireEvent.click(getByRole("button", { name: "Limpiar búsqueda" }));

    expect(sessionStorage.getItem("omdb-search-state")).toBeNull();
    expect(window.location.pathname).toBe("/");
    expect(window.location.search).toBe("");
  });
});
