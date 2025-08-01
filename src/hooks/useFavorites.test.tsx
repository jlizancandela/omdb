import { vi } from "vitest";
import { Context } from "../context/Provider";
import type { OmdbMovieShort } from "../models/omdb";
import { act, renderHook } from "@testing-library/react";
import { useFavorites } from "./useFavorites";

describe("useFavorites", () => {
  let fav: OmdbMovieShort[] = [];
  const setFav = vi.fn((newFav) => (fav = newFav));
  const lastPage = "";
  const setLastpage = vi.fn();

  const movie: OmdbMovieShort = {
    Title: "Test Movie",
    Year: "2022",
    imdbID: "tt1234567",
    Type: "movie",
    Poster: "https://example.com/poster.jpg",
  };

  const wrapper = ({ children }: any) => (
    <Context.Provider value={{ fav, setFav, lastPage, setLastpage }}>
      {children}
    </Context.Provider>
  );

  test("should return initial values", () => {
    const { result } = renderHook(() => useFavorites(), {
      wrapper,
    });
    expect(result.current.fav).toEqual([]);
    expect(result.current.toggleFav).toBeDefined();
    expect(result.current.isFav).toBeDefined();

    expect(result.current.isFav(movie.imdbID)).toBe(false);
  });

  test("should add movie to favorites", () => {
    const { result, rerender } = renderHook(() => useFavorites(), {
      wrapper,
    });
    act(() => {
      result.current.toggleFav(movie);
    });

    expect(setFav).toHaveBeenCalledWith([movie]);

    fav = [movie];
    rerender();

    expect(result.current.isFav(movie.imdbID)).toBe(true);
  });

  test("should remove movie from favorites", () => {
    const { result } = renderHook(() => useFavorites(), {
      wrapper,
    });
    act(() => {
      result.current.toggleFav(movie);
    });

    expect(setFav).toHaveBeenCalledWith([]);
  });
});
