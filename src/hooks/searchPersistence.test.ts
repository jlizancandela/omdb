import type { OmdbSearchResult } from "../models/omdb";
import {
  clearSearchState,
  readSearchState,
  writeSearchState,
} from "./searchPersistence";

const result: OmdbSearchResult = {
  Search: [
    {
      Title: "Spider-Man",
      Year: "2022",
      imdbID: "tt1234567",
      Type: "movie",
      Poster: "poster.jpg",
    },
  ],
  totalResults: "1",
  Response: "True",
};

describe("search persistence", () => {
  beforeEach(() => sessionStorage.clear());

  test("restores loaded pages and merged results", () => {
    writeSearchState(
      "spider",
      2,
      { "spider-1": result, "spider-2": result },
      result
    );

    expect(readSearchState("spider")).toMatchObject({
      query: "spider",
      page: 2,
      data: result,
      cache: { "spider-1": result, "spider-2": result },
    });
  });

  test("invalidates expired or malformed state", () => {
    sessionStorage.setItem(
      "omdb-search-state",
      JSON.stringify({
        version: 1,
        query: "spider",
        savedAt: Date.now() - 16 * 60 * 1000,
      })
    );

    expect(readSearchState("spider")).toBeNull();
    expect(sessionStorage.getItem("omdb-search-state")).toBeNull();

    sessionStorage.setItem("omdb-search-state", "not-json");
    expect(readSearchState("spider")).toBeNull();
  });

  test("clearing removes the persisted search state", () => {
    writeSearchState("spider", 1, { "spider-1": result }, result);
    clearSearchState();

    expect(sessionStorage.getItem("omdb-search-state")).toBeNull();
  });
});
