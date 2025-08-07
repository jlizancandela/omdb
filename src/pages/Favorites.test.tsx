import { vi } from "vitest";
import * as FavoritesImport from "../hooks/useFavorites";
import { render } from "@testing-library/react";
import type { OmdbMovieShort } from "../models/omdb";
import { Favorites } from "./Favorites";
import { MemoryRouter } from "react-router";

vi.mock("../hooks/useFavorites");

describe("Favorites", () => {
  const favResults: OmdbMovieShort[] = [
    {
      Title: "Test Movie",
      Year: "2022",
      imdbID: "tt1234567",
      Type: "movie",
      Poster: "https://example.com/poster.jpg",
    },
  ];

  const useFavorites = vi.mocked(FavoritesImport);
  useFavorites.useFavorites.mockReturnValue({
    fav: favResults,
    toggleFav: vi.fn(),
    isFav: vi.fn().mockReturnValue(false),
  });

  const wrapper = ({ children }: any) => (
    <MemoryRouter>{children}</MemoryRouter>
  );

  test("should render Favorites component", () => {
    const { getByText } = render(<Favorites />, { wrapper });
    expect(getByText("Favorites")).toBeInTheDocument();
  });

  test("should render Movies component", () => {
    const { getByText } = render(<Favorites />, { wrapper });
    expect(getByText("Test Movie")).toBeInTheDocument();
  });
});
