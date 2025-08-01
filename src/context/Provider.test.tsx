import { renderHook } from "@testing-library/react";
import { Context, Provider } from "./Provider";
import { vi } from "vitest";
import type { OmdbMovieShort } from "../models/omdb";
import { useContext } from "react";

describe("Provider", () => {
  const favoritesMovies: OmdbMovieShort[] = [
    {
      Title: "Test Movie",
      Year: "2022",
      imdbID: "tt1234567",
      Type: "movie",
      Poster: "https://example.com/poster.jpg",
    },
  ];

  vi.stubGlobal("localStorage", {
    getItem: vi.fn().mockReturnValue(JSON.stringify(favoritesMovies)),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  });

  const { result } = renderHook(() => useContext(Context), {
    wrapper: ({ children }) => <Provider>{children}</Provider>,
  });

  test("should render with initial values", () => {
    if (!result.current) throw new Error("Context is not defined");
    expect(result.current).toBeDefined();
    expect(result.current.fav).toEqual(favoritesMovies);
    expect(result.current.setFav).toBeDefined();
    expect(result.current.lastPage).toEqual("");
    expect(result.current.setLastpage).toBeDefined();
  });
});
