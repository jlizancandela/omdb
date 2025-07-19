import type { OmdbMovieShort, OmdbSearchResult } from "../models/omdb";

export const api = "https://www.omdbapi.com/";

export const getMovies = (
  pelicula: string,
  page: number,
  cache: Record<string, OmdbSearchResult>
): Promise<OmdbSearchResult | undefined> => {
  const claveCache = `${pelicula}-${page}`;

  if (cache[claveCache]) {
    return Promise.resolve(cache[claveCache]);
  }

  return fetch(
    `${api}?s=${pelicula}&page=${page}&apikey=${import.meta.env.VITE_API_KEY}`
  )
    .then((response) => response.json())
    .then((data: OmdbSearchResult) => data)
    .catch((error) => {
      console.error("Error al obtener datos de OMDb:", error);
      return undefined;
    });
};

export const hasMore = (data: OmdbSearchResult | null) => {
  if (!data) return false;

  return data?.Search?.length < parseInt(data?.totalResults || "0");
};

export const filtrarPeliculasUnicas = (
  anteriores: OmdbMovieShort[],
  nuevas: OmdbMovieShort[]
): OmdbMovieShort[] => {
  const ids = new Set(anteriores.map((p) => p.imdbID));
  return nuevas.filter((p) => !ids.has(p.imdbID));
};

export const getMovieById = (id: string) => {
  return fetch(`${api}?i=${id}&apikey=${import.meta.env.VITE_API_KEY}`)
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => {
      console.error("Error al obtener datos de OMDb:", error);
      return undefined;
    });
};
