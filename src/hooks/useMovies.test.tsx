import { act, renderHook, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { Context } from "../context/Provider";
import { useMovies } from "./useMovies";
import * as debounce from "./useDebouncedValue";
import * as intersection from "./useIntersectionObserver";
import * as omdb from "../services/omdb";
import type { OmdbSearchResult } from "../models/omdb";
import type { ReactNode } from "react";

vi.mock("./useDebouncedValue");
vi.mock("./useIntersectionObserver");
vi.mock("../services/omdb");

describe("useMovies", () => {
  const useDebouncedValue = vi.mocked(debounce.useDebouncedValue);
  const useIntersectionObserver = vi.mocked(
    intersection.useIntersectionObserver
  );
  const getMovies = vi.mocked(omdb.getMovies);
  const hasMore = vi.mocked(omdb.hasMore);
  const filtrarPeliculasUnicas = vi.mocked(omdb.filtrarPeliculasUnicas);

  const setLastpage = vi.fn();
  const wrapper = ({ children }: { children: ReactNode }) => (
    <Context.Provider
      value={{ fav: [], setFav: vi.fn(), lastPage: "", setLastpage }}
    >
      {children}
    </Context.Provider>
  );

  let intersectionCallback: () => void = () => {};

  beforeEach(() => {
    vi.clearAllMocks();
    useDebouncedValue.mockImplementation((value) => value);
    useIntersectionObserver.mockImplementation((cb) => {
      intersectionCallback = cb;
      return vi.fn();
    });
  });

  test("should return initial values", () => {
    const { result } = renderHook(() => useMovies(), { wrapper });

    expect(result.current.data).toBeNull();
    expect(typeof result.current.setSearch).toBe("function");
    expect(typeof result.current.lastid).toBe("function");
  });

  test("should fetch movies when search is set", async () => {
    const movieData: OmdbSearchResult = {
      Search: [
        {
          Title: "Test Movie",
          Year: "2022",
          imdbID: "tt1234567",
          Type: "movie",
          Poster: "https://example.com/poster.jpg",
        },
      ],
      totalResults: "1",
      Response: "True",
    };
    getMovies.mockResolvedValueOnce(movieData);

    const { result } = renderHook(() => useMovies(), { wrapper });

    act(() => {
      result.current.setSearch("Batman");
    });

    await waitFor(() => {
      expect(result.current.data).toEqual(movieData);
    });

    expect(getMovies).toHaveBeenCalledWith("Batman", 1);
    expect(setLastpage).toHaveBeenCalledWith("Batman");
  });

  test("should append movies when loading next page", async () => {
    hasMore.mockReturnValue(true);
    filtrarPeliculasUnicas.mockImplementation((_, nuevo) => nuevo);

    const page1: OmdbSearchResult = {
      Search: [
        {
          Title: "First",
          Year: "2023",
          imdbID: "tt1",
          Type: "movie",
          Poster: "url1",
        },
      ],
      totalResults: "2",
      Response: "True",
    };

    const page2: OmdbSearchResult = {
      Search: [
        {
          Title: "Second",
          Year: "2024",
          imdbID: "tt2",
          Type: "movie",
          Poster: "url2",
        },
      ],
      totalResults: "2",
      Response: "True",
    };

    getMovies.mockResolvedValueOnce(page1).mockResolvedValueOnce(page2);

    const { result } = renderHook(() => useMovies(), { wrapper });

    act(() => {
      result.current.setSearch("Spiderman");
    });

    await waitFor(() => {
      expect(result.current.data).toEqual(page1);
    });

    act(() => {
      intersectionCallback();
    });

    await waitFor(() => {
      expect(getMovies).toHaveBeenCalledTimes(2);
      expect(result.current.data?.Search).toHaveLength(2);
    });

    expect(result.current.data?.Search[0]).toEqual(page1.Search[0]);
    expect(result.current.data?.Search[1]).toEqual(page2.Search[0]);
  });

  test("should clear movies when search is cleared", async () => {
    const movieData: OmdbSearchResult = {
      Search: [
        {
          Title: "Test Movie",
          Year: "2022",
          imdbID: "tt1234567",
          Type: "movie",
          Poster: "https://example.com/poster.jpg",
        },
      ],
      totalResults: "1",
      Response: "True",
    };
    getMovies.mockResolvedValueOnce(movieData);

    const { result } = renderHook(() => useMovies(), { wrapper });

    act(() => {
      result.current.setSearch("Batman");
    });

    await waitFor(() => {
      expect(result.current.data).toEqual(movieData);
    });

    act(() => {
      result.current.setSearch("");
    });

    await waitFor(() => {
      expect(result.current.data).toBeNull();
    });
    expect(setLastpage).toHaveBeenCalledWith("");
    expect(window.location.pathname).toBe("/");
  });

  test("should reset movies when navigating to home", async () => {
    const movieData: OmdbSearchResult = {
      Search: [
        {
          Title: "Test Movie",
          Year: "2022",
          imdbID: "tt1234567",
          Type: "movie",
          Poster: "https://example.com/poster.jpg",
        },
      ],
      totalResults: "1",
      Response: "True",
    };
    getMovies.mockResolvedValueOnce(movieData);

    const { result, rerender } = renderHook(
      ({ movie }: { movie: string }) => useMovies(movie),
      { initialProps: { movie: "Batman" }, wrapper }
    );

    await waitFor(() => {
      expect(result.current.data).toEqual(movieData);
    });

    rerender({ movie: "" });

    await waitFor(() => {
      expect(result.current.data).toBeNull();
    });
    expect(setLastpage).toHaveBeenCalledWith("");
  });
});
