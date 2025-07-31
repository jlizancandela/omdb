import { vi } from "vitest";
import { Context } from "../context/Provider";
import type { OmdbMovieShort } from "../models/omdb";
import { act, renderHook } from "@testing-library/react";
import { useFavorites } from "./useFavorites";

test("useFavorites", () => {
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

  const { result, rerender } = renderHook(() => useFavorites(), {
    wrapper,
  });

  expect(result.current.fav).toEqual([]);
  expect(result.current.toggleFav).toBeDefined();
  expect(result.current.isFav).toBeDefined();

  expect(result.current.isFav(movie.imdbID)).toBe(false);

  act(() => {
    result.current.toggleFav(movie);
  });

  expect(setFav).toHaveBeenCalledWith([movie]);

  fav = [movie];
  rerender();

  expect(result.current.isFav(movie.imdbID)).toBe(true);

  act(() => {
    result.current.toggleFav(movie);
  });

  expect(setFav).toHaveBeenCalledWith([]);
});
