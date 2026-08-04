import { vi } from "vitest";
import * as useMovieDetailsImport from "../hooks/useMovieDetails";
import { Context } from "../context/Provider";
import { MemoryRouter } from "react-router";
import { render } from "@testing-library/react";
import { Movie } from "./Movie";
import type { OmdbServiceError } from "../services/omdb";

vi.mock("../hooks/useMovieDetails");

describe("Movie", () => {
  const useMovieDetails = vi.mocked(useMovieDetailsImport.useMovieDetails);

  const movie: any = {
    Title: "Test Movie",
    Year: "2022",
    imdbID: "tt1234567",
    Type: "movie",
    Poster: "https://example.com/poster.jpg",
  };

  const defaultHookValue = {
    data: movie,
    loading: false,
    error: null,
    errorMessage: null,
    retry: vi.fn(),
    isFav: vi.fn().mockReturnValue(false),
    toggleFav: vi.fn(),
  };

  beforeEach(() => {
    useMovieDetails.mockReturnValue(defaultHookValue);
  });

  const wrapper = ({ children }: any) => (
    <Context
      value={{ fav: [], setFav: vi.fn(), lastPage: "", setLastpage: vi.fn() }}
    >
      <MemoryRouter>{children}</MemoryRouter>
    </Context>
  );

  test("should render Movie component", () => {
    const { getByText } = render(<Movie />, { wrapper });
    expect(getByText("Test Movie")).toBeInTheDocument();
  });

  test.each([
    [
      "not found",
      { kind: "api", message: "Movie not found!" },
      "We couldn't find a movie with that IMDb ID.",
    ],
    [
      "API errors",
      { kind: "api", message: "Invalid IMDb ID" },
      "OMDb couldn't load this movie. Check the IMDb ID and try again.",
    ],
    [
      "service errors",
      { kind: "http", message: "The service is unavailable" },
      "The movie service is temporarily unavailable. Try again shortly.",
    ],
    [
      "network errors",
      { kind: "network", message: "Could not reach the service" },
      "We couldn't connect to the movie service. Check your connection and try again.",
    ],
    [
      "cancellation errors",
      { kind: "cancelled", message: "Request was cancelled" },
      "The movie request was cancelled. Try again to load the details.",
    ],
  ])("should explain %s", (_, error, message) => {
    useMovieDetails.mockReturnValue({
      ...defaultHookValue,
      data: undefined,
      error: error as OmdbServiceError,
    });

    const { getByRole } = render(<Movie />, { wrapper });

    expect(getByRole("alert")).toHaveTextContent(message);
    expect(getByRole("button", { name: "Try again" })).toBeInTheDocument();
  });
});
