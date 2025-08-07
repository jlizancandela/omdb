import { render } from "@testing-library/react";
import { Router } from "./Router";
import { Context } from "../context/Provider";
import { vi } from "vitest";
import * as useMovieDetailsImport from "../hooks/useMovieDetails";
import type { OmdbMovieDetails } from "../models/omdb";

vi.mock("../hooks/useMovieDetails");

describe("Router", () => {
  const wrapper = ({ children }: any) => (
    <Context
      value={{ fav: [], setFav: vi.fn(), lastPage: "", setLastpage: vi.fn() }}
    >
      {children}
    </Context>
  );

  const useMovieDetails = vi.mocked(useMovieDetailsImport.useMovieDetails);

  const movie: OmdbMovieDetails = {
    Title: "Test Movie",
    Year: "2022",
    imdbID: "tt1234567",
    Type: "movie",
    Poster: "https://example.com/poster.jpg",
    Runtime: "120 min",
    Genre: "Drama, Thriller",
    Director: "John Doe",
    Actors: "Actor 1, Actor 2",
    Plot: "This is a test movie",
    imdbRating: "8.5",
    imdbVotes: "100,000",
    Rated: "PG-13",
    Released: "2022-01-01",
    Language: "English",
    Country: "USA",
    Awards: "Nominated for 2 Oscars",
    Metascore: "75",
    DVD: "2022-02-01",
    BoxOffice: "$1,000,000",
    Production: "Production Company",
    Website: "https://example.com",
    Response: "True",
    Error: "",
    Ratings: [
      {
        Source: "Internet Movie Database",
        Value: "8.5",
      },
    ],
    Writer: "Writer 1, Writer 2",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useMovieDetails.mockReturnValue({
      data: movie,
      loading: false,
      error: null,
      isFav: vi.fn().mockReturnValue(false),
      toggleFav: vi.fn(),
    });
  });

  test("should render Router component", () => {
    window.history.pushState({}, "", "/");
    const { getByText } = render(<Router />, { wrapper });
    expect(getByText("Proyecto OMDB")).toBeInTheDocument();
  });

  test("should render Movie component", () => {
    window.history.pushState({}, "", "/movie/123");
    const { getByText } = render(<Router />, { wrapper });
    expect(getByText("Test Movie")).toBeInTheDocument();
  });

  test("should render Favorites component", () => {
    window.history.pushState({}, "", "/favorites");
    const { getByRole } = render(<Router />, { wrapper });
    expect(getByRole("heading", { name: "Favorites" })).toBeInTheDocument();
  });
});
