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
      "No se encontró una película con ese ID de IMDb.",
    ],
    [
      "API errors",
      { kind: "api", message: "Invalid IMDb ID" },
      "OMDb no pudo cargar esta película. Comprueba el ID de IMDb e inténtalo de nuevo.",
    ],
    [
      "service errors",
      { kind: "http", message: "The service is unavailable" },
      "El servicio de películas no está disponible temporalmente. Inténtalo de nuevo en unos instantes.",
    ],
    [
      "network errors",
      { kind: "network", message: "Could not reach the service" },
      "No se pudo conectar con el servicio de películas. Comprueba tu conexión e inténtalo de nuevo.",
    ],
    [
      "cancellation errors",
      { kind: "cancelled", message: "Request was cancelled" },
      "La solicitud de la película se canceló. Inténtalo de nuevo para cargar los detalles.",
    ],
  ])("should explain %s", (_, error, message) => {
    useMovieDetails.mockReturnValue({
      ...defaultHookValue,
      data: undefined,
      error: error as OmdbServiceError,
    });

    const { getByRole } = render(<Movie />, { wrapper });

    expect(getByRole("alert")).toHaveTextContent(message);
    expect(getByRole("button", { name: "Intentar de nuevo" })).toBeInTheDocument();
  });
});
