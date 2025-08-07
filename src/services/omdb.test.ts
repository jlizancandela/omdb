import { server } from "../mocks/server";
import type { OmdbMovieShort } from "../models/omdb";
import {
  filtrarPeliculasUnicas,
  getMovieById,
  getMovies,
  hasMore,
  toShortMovie,
} from "./omdb";

beforeAll(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});

describe("OMDB API", () => {
  test("should return movies", async () => {
    const response = getMovies("mock", 1, {});

    const data = await response;
    if (!data) return;

    expect(data.Search.length).toBeGreaterThan(0);
    expect(data.Response).toBe("True");
    expect(data.totalResults).toBe("10");

    const movie1 = data.Search[0];
    const movie2 = data.Search[1];

    expect(movie1.Title).toBe("Mock Movie 1");
    expect(movie2.Title).toBe("Mock Movie 2");
  });

  test("should return movie details", async () => {
    const response = getMovieById("tt1234567");

    const data = await response;
    if (!data) return;

    expect(data.Title).toBe("Mock Movie by ID");
    expect(data.Year).toBe("2020");
    expect(data.imdbID).toBe("tt1234567");
    expect(data.Type).toBe("movie");
    expect(data.Poster).toBe("N/A");
  });

  test("should transform movie details", async () => {
    const response = getMovieById("tt1234567");

    const data = await response;
    if (!data) return;

    const transformedData = toShortMovie(data);

    expect(transformedData).toEqual({
      Title: "Mock Movie by ID",
      Year: "2020",
      imdbID: "tt1234567",
      Type: "movie",
      Poster: "N/A",
    });
  });

  test("has more should return true", async () => {
    const response = getMovies("mock", 1, {});

    const data = await response;
    if (!data) return;

    expect(hasMore(data)).toBe(true);
  });

  test("filter unique movies", () => {
    const existingMovies: OmdbMovieShort[] = [
      {
        Title: "Mock Movie 1",
        Year: "2020",
        imdbID: "tt1234567",
        Type: "movie",
        Poster: "N/A",
      },
      {
        Title: "Mock Movie 2",
        Year: "2021",
        imdbID: "tt7654321",
        Type: "movie",
        Poster: "N/A",
      },
    ];

    const incomingMovies: OmdbMovieShort[] = [
      {
        Title: "Mock Movie 1",
        Year: "2020",
        imdbID: "tt1234567",
        Type: "movie",
        Poster: "N/A",
      },
      {
        Title: "Mock Movie 3",
        Year: "2021",
        imdbID: "tt7654211",
        Type: "movie",
        Poster: "N/A",
      },
    ];

    const result = filtrarPeliculasUnicas(existingMovies, incomingMovies);
    expect(result.length).toBe(1);
    expect(result[0].Title).toBe("Mock Movie 3");
  });
});
