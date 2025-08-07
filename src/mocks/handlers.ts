import { http, HttpResponse } from "msw";
import { api } from "../services/omdb";

export const handlers = [
  http.get(api, ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get("s");
    const id = url.searchParams.get("i");

    if (search) {
      return HttpResponse.json({
        Response: "True",
        totalResults: "10",
        Search: [
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
        ],
      });
    }
    if (id) {
      return HttpResponse.json({
        Title: "Mock Movie by ID",
        Year: "2020",
        imdbID: id,
        Type: "movie",
        Poster: "N/A",
        Response: "True",
      });
      return HttpResponse.json(
        { Response: "False", Error: "Missing query" },
        { status: 400 }
      );
    }
  }),
];
