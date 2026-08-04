import type {
  OmdbMovieDetails,
  OmdbMovieShort,
  OmdbSearchResult,
} from "../models/omdb";

export const api = "https://www.omdbapi.com/";
const apiKey = import.meta.env.VITE_API_KEY || window.API_KEY;

export type OmdbErrorKind =
  | "http"
  | "api"
  | "network"
  | "invalid-payload"
  | "cancelled";

export class OmdbServiceError extends Error {
  readonly kind: OmdbErrorKind;
  readonly status?: number;
  readonly retryable: boolean;

  constructor(
    kind: OmdbErrorKind,
    message: string,
    options: { status?: number; retryable?: boolean } = {}
  ) {
    super(message);
    this.name = "OmdbServiceError";
    this.kind = kind;
    this.status = options.status;
    this.retryable = options.retryable ?? kind !== "api";
  }
}

export const isOmdbServiceError = (error: unknown): error is OmdbServiceError =>
  error instanceof OmdbServiceError;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isMovie = (value: unknown): boolean => {
  if (!isRecord(value)) return false;
  return (
    typeof value.Title === "string" &&
    typeof value.Year === "string" &&
    typeof value.imdbID === "string" &&
    typeof value.Type === "string" &&
    typeof value.Poster === "string"
  );
};

const parsePayload = async (response: Response): Promise<unknown> => {
  try {
    return await response.json();
  } catch {
    throw new OmdbServiceError(
      "invalid-payload",
      "OMDb devolvió JSON no válido.",
      { retryable: true }
    );
  }
};

const request = async (url: string, signal?: AbortSignal): Promise<unknown> => {
  if (signal?.aborted) {
    throw new OmdbServiceError("cancelled", "La solicitud se canceló.", {
      retryable: false,
    });
  }
  let response: Response;
  try {
    response = await fetch(url, { signal });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new OmdbServiceError("cancelled", "La solicitud se canceló.", {
        retryable: false,
      });
    }
    throw new OmdbServiceError(
      "network",
      "No se pudo acceder al servicio de OMDb.",
      { retryable: true }
    );
  }

  if (!response.ok) {
    throw new OmdbServiceError(
      "http",
      "El servicio de OMDb devolvió un error HTTP.",
      { status: response.status, retryable: response.status === 429 || response.status >= 500 }
    );
  }

  return parsePayload(response);
};

const parseSearchResult = (payload: unknown): OmdbSearchResult => {
  if (!isRecord(payload)) {
    throw new OmdbServiceError("invalid-payload", "OMDb devolvió una respuesta inesperada.");
  }
  if (payload.Response === "False") {
    throw new OmdbServiceError(
      "api",
      typeof payload.Error === "string" ? payload.Error : "OMDb rechazó la búsqueda."
    );
  }
  if (
    payload.Response !== "True" ||
    typeof payload.totalResults !== "string" ||
    !Array.isArray(payload.Search) ||
    !payload.Search.every(isMovie)
  ) {
    throw new OmdbServiceError("invalid-payload", "OMDb devolvió una respuesta inesperada.");
  }
  return payload as unknown as OmdbSearchResult;
};

const parseMovieDetails = (payload: unknown): OmdbMovieDetails => {
  if (!isRecord(payload)) {
    throw new OmdbServiceError("invalid-payload", "OMDb devolvió una respuesta inesperada.");
  }
  if (payload.Response === "False") {
    throw new OmdbServiceError(
      "api",
      typeof payload.Error === "string" ? payload.Error : "OMDb rejected the movie lookup."
    );
  }
  if (
    payload.Response !== "True" ||
    typeof payload.Title !== "string" ||
    typeof payload.imdbID !== "string" ||
    typeof payload.Type !== "string"
  ) {
    throw new OmdbServiceError("invalid-payload", "OMDb devolvió una respuesta inesperada.");
  }
  return payload as unknown as OmdbMovieDetails;
};

export const getMovies = (
  pelicula: string,
  page: number,
  signal?: AbortSignal
): Promise<OmdbSearchResult> =>
  request(`${api}?s=${encodeURIComponent(pelicula)}&type=movie&page=${page}&apikey=${apiKey}`, signal).then(
    parseSearchResult
  );

export const hasMore = (data: OmdbSearchResult | null) => {
  if (!data || !Array.isArray(data.Search)) return false;

  const totalResults = Number.parseInt(data.totalResults || "0", 10);
  return Number.isFinite(totalResults) && data.Search.length < totalResults;
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
  id: string,
  signal?: AbortSignal
): Promise<OmdbMovieDetails> =>
  request(`${api}?i=${encodeURIComponent(id)}&apikey=${apiKey}`, signal).then(
    parseMovieDetails
  );

export const getOmdbErrorMessage = (error: OmdbServiceError): string => {
  switch (error.kind) {
    case "api":
      if (/not found/i.test(error.message)) return "No se encontró la película.";
      if (/too many results/i.test(error.message)) return "La búsqueda devuelve demasiados resultados.";
      if (/incorrect imdb id/i.test(error.message)) return "El ID de IMDb no es correcto.";
      return error.message;
    case "network":
      return "No se pudo acceder al servicio de películas. Comprueba tu conexión e inténtalo de nuevo.";
    case "http":
      return "El servicio de películas no está disponible temporalmente. Inténtalo de nuevo en unos instantes.";
    case "invalid-payload":
      return "El servicio de películas devolvió una respuesta inesperada.";
    case "cancelled":
      return "";
  }
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
