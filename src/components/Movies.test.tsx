import { render } from "@testing-library/react";
import type { OmdbMovieShort } from "../models/omdb";
import { Movies } from "./Movies";
import { vi } from "vitest";
import * as Favorites from "../hooks/useFavorites";
import { MemoryRouter } from "react-router";

vi.mock("../hooks/useFavorites");

describe("Movies", () => {
  const mockupMovies: OmdbMovieShort[] = [
    {
      Title: "Test Movie",
      Year: "2022",
      imdbID: "tt1234567",
      Type: "movie",
      Poster: "https://example.com/poster.jpg",
    },
    {
      Title: "Test Movie 2",
      Year: "2022",
      imdbID: "tt1234568",
      Type: "movie",
      Poster: "https://example.com/poster.jpg",
    },
  ];

  const mockupUseFavorites = vi.mocked(Favorites);
  mockupUseFavorites.useFavorites.mockReturnValue({
    fav: [],
    toggleFav: vi.fn(),
    isFav: vi.fn().mockReturnValue(false),
  });

  const result = render(
    <MemoryRouter>
      <Movies movies={mockupMovies} />
    </MemoryRouter>
  );

  test("should render movies", () => {
    expect(result.getByText("Test Movie")).toBeInTheDocument();
    expect(result.getByText("Test Movie 2")).toBeInTheDocument();
  });
});
