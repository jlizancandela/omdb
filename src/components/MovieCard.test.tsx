import { test, vi, expect, describe } from "vitest";
import * as favorites from "../hooks/useFavorites";
import { render } from "@testing-library/react";
import { MovieCard } from "./MovieCard";
import type { OmdbMovieShort } from "../models/omdb";
import { MemoryRouter } from "react-router";

vi.mock("../hooks/useFavorites");

describe("MovieCard", () => {
  test("should render movie card", () => {
    const mockupMovie: OmdbMovieShort = {
      Title: "Test Movie",
      Year: "2022",
      imdbID: "tt1234567",
      Type: "movie",
      Poster: "https://example.com/poster.jpg",
    };
    const mockupFav = vi.mocked(favorites);
    mockupFav.useFavorites.mockReturnValue({
      fav: [],
      toggleFav: vi.fn(),
      isFav: vi.fn().mockReturnValue(false),
    });
    const result = render(
      <MemoryRouter>
        <MovieCard movie={mockupMovie} />
      </MemoryRouter>
    );

    expect(result.getByText("Test Movie")).toBeInTheDocument();
    expect(result.getByText("2022")).toBeInTheDocument();
    expect(
      result.getByRole("button", { name: "Add to favorites" })
    ).toBeInTheDocument();
  });
});
