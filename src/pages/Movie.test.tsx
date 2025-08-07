import { vi } from "vitest";
import * as useMovieDetailsImport from "../hooks/useMovieDetails";
import { Context } from "../context/Provider";
import { MemoryRouter } from "react-router";
import { render } from "@testing-library/react";
import { Movie } from "./Movie";

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

  useMovieDetails.mockReturnValue({
    data: movie,
    loading: false,
    error: null,
    isFav: vi.fn().mockReturnValue(false),
    toggleFav: vi.fn(),
  });

  const wrapper = ({ children }: any) => (
    <Context
      value={{ fav: [], setFav: vi.fn(), lastPage: "", setLastpage: vi.fn() }}
    >
      <MemoryRouter>{children}</MemoryRouter>
    </Context>
  );

  beforeAll(() => {
    vi.clearAllMocks;
  });

  test("should render Movie component", () => {
    const { getByText } = render(<Movie />, { wrapper });
    expect(getByText("Test Movie")).toBeInTheDocument();
  });
});
