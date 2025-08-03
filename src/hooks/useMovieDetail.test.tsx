import { vi } from "vitest";
import * as favorites from "../hooks/useFavorites";
import { renderHook, waitFor } from "@testing-library/react";
import { useMovieDetails } from "./useMovieDetails";
import * as omdb from "../services/omdb";

vi.mock("../hooks/useFavorites");
vi.mock("../services/omdb");

describe("useMovieDetail", () => {
  const useFavorites = vi.mocked(favorites);
  useFavorites.useFavorites.mockReturnValue({
    fav: [],
    toggleFav: vi.fn(),
    isFav: vi.fn().mockReturnValue(false),
  });

  const getMovieById = vi.mocked(omdb.getMovieById);
  getMovieById.mockResolvedValue({
    Title: "Test Movie",
    Year: "2022",
    imdbID: "tt1234567",
    Type: "movie",
    Poster: "https://example.com/poster.jpg",
  });

  beforeEach(() => {
    getMovieById.mockClear(); // limpia los mocks antes de cada test
  });

  test("should return movie details", async () => {
    const { result } = renderHook(() => useMovieDetails("tt1234567"));
    await waitFor(() => {
      expect(result.current.data).toEqual({
        Title: "Test Movie",
        Year: "2022",
        imdbID: "tt1234567",
        Type: "movie",
        Poster: "https://example.com/poster.jpg",
      });
    });
  });
});
