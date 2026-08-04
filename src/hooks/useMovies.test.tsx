import { act, renderHook, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { Context } from "../context/Provider";
import { useMovies } from "./useMovies";
import * as debounce from "./useDebouncedValue";
import * as intersection from "./useIntersectionObserver";
import * as omdb from "../services/omdb";
import type { OmdbSearchResult } from "../models/omdb";
import type { OmdbServiceError } from "../services/omdb";
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

  let intersectionCallback: (entry: IntersectionObserverEntry) => void = () => {};

  beforeEach(() => {
    vi.resetAllMocks();
    useDebouncedValue.mockImplementation((value) => value);
    useIntersectionObserver.mockImplementation((cb) => {
      intersectionCallback = cb;
      return vi.fn();
    });
    filtrarPeliculasUnicas.mockImplementation((_, nuevo) => nuevo);
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

    expect(getMovies).toHaveBeenCalledWith("Batman", 1, expect.any(AbortSignal));
    expect(setLastpage).toHaveBeenCalledWith("Batman");
  });

  test("should append movies when loading next page", async () => {
    hasMore.mockReturnValue(true);

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
      intersectionCallback({ isIntersecting: true } as IntersectionObserverEntry);
    });

    await waitFor(() => {
      expect(getMovies).toHaveBeenCalledTimes(2);
      expect(result.current.data?.Search).toHaveLength(2);
    });

    expect(result.current.data?.Search[0]).toEqual(page1.Search[0]);
    expect(result.current.data?.Search[1]).toEqual(page2.Search[0]);
  });

  test("should only advance once while the sentinel stays intersecting", async () => {
    hasMore.mockReturnValue(true);

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
      intersectionCallback({ isIntersecting: true } as IntersectionObserverEntry);
      intersectionCallback({ isIntersecting: true } as IntersectionObserverEntry);
    });

    await waitFor(() => {
      expect(getMovies).toHaveBeenCalledTimes(2);
      expect(result.current.data?.Search).toHaveLength(2);
    });
  });

  test("should allow another page load after the sentinel leaves and re-enters", async () => {
    hasMore.mockReturnValue(true);

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
      totalResults: "3",
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
      totalResults: "3",
      Response: "True",
    };

    const page3: OmdbSearchResult = {
      Search: [
        {
          Title: "Third",
          Year: "2025",
          imdbID: "tt3",
          Type: "movie",
          Poster: "url3",
        },
      ],
      totalResults: "3",
      Response: "True",
    };

    getMovies
      .mockResolvedValueOnce(page1)
      .mockResolvedValueOnce(page2)
      .mockResolvedValueOnce(page3);

    const { result } = renderHook(() => useMovies(), { wrapper });

    act(() => {
      result.current.setSearch("Spiderman");
    });

    await waitFor(() => {
      expect(result.current.data).toEqual(page1);
    });

    act(() => {
      intersectionCallback({ isIntersecting: true } as IntersectionObserverEntry);
    });

    await waitFor(() => {
      expect(result.current.data?.Search).toHaveLength(2);
    });

    act(() => {
      intersectionCallback({ isIntersecting: false } as IntersectionObserverEntry);
      intersectionCallback({ isIntersecting: true } as IntersectionObserverEntry);
    });

    await waitFor(() => {
      expect(result.current.data?.Search).toHaveLength(3);
      expect(getMovies).toHaveBeenCalledTimes(3);
    });
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
    expect(sessionStorage.getItem("omdb-search-state")).toBeNull();
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

  test("should expose initial errors and retry them", async () => {
    const error = {
      kind: "http",
      message: "Service unavailable.",
      retryable: true,
    } as OmdbServiceError;
    getMovies.mockRejectedValueOnce(error).mockResolvedValueOnce({
      Search: [],
      totalResults: "0",
      Response: "True",
    });

    const { result } = renderHook(() => useMovies(), { wrapper });
    act(() => result.current.setSearch("Batman"));

    await waitFor(() => expect(result.current.error).toBe(error));
    expect(result.current.data).toBeNull();

    act(() => result.current.retry());
    await waitFor(() => expect(result.current.error).toBeNull());
    expect(getMovies).toHaveBeenCalledTimes(2);
  });

  test("keeps existing results when pagination fails and retries the page", async () => {
    hasMore.mockReturnValue(true);
    const page1: OmdbSearchResult = {
      Search: [{ Title: "First", Year: "2023", imdbID: "tt1", Type: "movie", Poster: "url1" }],
      totalResults: "2",
      Response: "True",
    };
    const page2: OmdbSearchResult = {
      Search: [{ Title: "Second", Year: "2024", imdbID: "tt2", Type: "movie", Poster: "url2" }],
      totalResults: "2",
      Response: "True",
    };
    getMovies.mockResolvedValueOnce(page1).mockRejectedValueOnce({
      kind: "network",
      message: "offline",
      retryable: true,
    } as OmdbServiceError).mockResolvedValueOnce(page2);

    const { result } = renderHook(() => useMovies(), { wrapper });
    act(() => result.current.setSearch("Batman"));
    await waitFor(() => expect(result.current.data).toEqual(page1));

    act(() => intersectionCallback({ isIntersecting: true } as IntersectionObserverEntry));
    await waitFor(() => expect(result.current.paginationError).not.toBeNull());
    expect(result.current.data?.Search).toEqual(page1.Search);

    act(() => result.current.retry());
    await waitFor(() => expect(result.current.data?.Search).toHaveLength(2));
    expect(result.current.paginationError).toBeNull();
  });

  test("ignores a stale search response", async () => {
    let resolveFirst: (data: OmdbSearchResult) => void = () => {};
    const first = new Promise<OmdbSearchResult>((resolve) => { resolveFirst = resolve; });
    const second: OmdbSearchResult = {
      Search: [{ Title: "Second", Year: "2024", imdbID: "tt2", Type: "movie", Poster: "url2" }],
      totalResults: "1",
      Response: "True",
    };
    getMovies.mockReturnValueOnce(first).mockResolvedValueOnce(second);

    const { result } = renderHook(() => useMovies(), { wrapper });
    act(() => result.current.setSearch("First"));
    act(() => result.current.setSearch("Second"));
    await waitFor(() => expect(result.current.data).toEqual(second));
    act(() => resolveFirst({ Search: [], totalResults: "0", Response: "True" }));

    expect(result.current.data).toEqual(second);
  });
});
