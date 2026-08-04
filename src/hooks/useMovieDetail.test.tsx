import { vi } from "vitest";
import * as favorites from "../hooks/useFavorites";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useMovieDetails } from "./useMovieDetails";
import * as omdb from "../services/omdb";
import type { OmdbServiceError } from "../services/omdb";

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
    getMovieById.mockClear();
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

  test("should reset and expose errors when the movie changes", async () => {
    getMovieById.mockRejectedValueOnce({
      kind: "api",
      message: "Movie not found!",
      retryable: false,
    } as OmdbServiceError);
    const { result, rerender } = renderHook(({ id }: { id: string }) => useMovieDetails(id), {
      initialProps: { id: "missing" },
    });

    await waitFor(() => expect(result.current.error?.kind).toBe("api"));
    act(() => rerender({ id: "tt1234567" }));
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(true);
  });

  test("ignores stale detail responses", async () => {
    let resolveFirst: (data: unknown) => void = () => {};
    const first = new Promise<unknown>((resolve) => { resolveFirst = resolve; });
    getMovieById.mockReset();
    getMovieById.mockReturnValueOnce(first).mockResolvedValueOnce({
      Title: "Second",
      Year: "2024",
      imdbID: "second",
      Type: "movie",
      Poster: "N/A",
    });

    const { result, rerender } = renderHook(({ id }: { id: string }) => useMovieDetails(id), {
      initialProps: { id: "first" },
    });
    act(() => rerender({ id: "second" }));
    await waitFor(() => expect(result.current.data?.imdbID).toBe("second"));
    resolveFirst({ Title: "First", Year: "2024", imdbID: "first", Type: "movie", Poster: "N/A" });
    expect(result.current.data?.imdbID).toBe("second");
  });
});
