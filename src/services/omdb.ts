import type {
  OmdbMovieDetails,
  OmdbMovieShort,
  OmdbSearchResult,
} from "../models/omdb";

export const api = "https://www.omdbapi.com/";

export const getMovies = (
  pelicula: string,
  page: number
): Promise<OmdbSearchResult | undefined> => {
  return fetch(
    `${api}?s=${pelicula}&type=movie&page=${page}&apikey=${import.meta.env.VITE_API_KEY}`
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
  // Considera duplicado si coincide el imdbID o si coinciden
  // Título normalizado + Poster (carátula)
  const normalizar = (s: string) => s.toLowerCase().trim().replace(/\s+/g, " ");

  const ids = new Set(anteriores.map((p) => p.imdbID));
  const claves = new Set(
    anteriores.map(
      (p) => `${normalizar(p.Title)}|${p.Poster ?? "N/A"}`
    )
  );

  const resultado: OmdbMovieShort[] = [];
  for (const p of nuevas) {
    const clave = `${normalizar(p.Title)}|${p.Poster ?? "N/A"}`;
    if (ids.has(p.imdbID) || claves.has(clave)) continue;
    // Añade y actualiza los sets para evitar duplicados dentro del propio lote
    resultado.push(p);
    ids.add(p.imdbID);
    claves.add(clave);
  }
  return resultado;
};

export const getMovieById = (
  id: string
): Promise<OmdbMovieDetails | undefined> => {
  return fetch(`${api}?i=${id}&apikey=${import.meta.env.VITE_API_KEY}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data: OmdbMovieDetails) => data)
    .catch((error) => {
      console.error("Error al obtener datos de OMDb:", error);
      return undefined;
    });
};

export const toShortMovie = (movie: OmdbMovieDetails) => {
  return {
    imdbID: movie.imdbID,
    Title: movie.Title,
    Year: movie.Year,
    Poster: movie.Poster,
    Type: movie.Type,
  };
};
