import { useEffect, useState } from "react";
import type { OmdbMovieDetails } from "../models/omdb";
import {
  getMovieById,
  getOmdbErrorMessage,
  isOmdbServiceError,
  type OmdbServiceError,
} from "../services/omdb";
import { useFavorites } from "./useFavorites";

const isServiceError = (error: unknown): error is OmdbServiceError =>
  typeof error === "object" &&
  error !== null &&
  "kind" in error &&
  "message" in error;

export const useMovieDetails = (id: string) => {
  const [data, setData] = useState<OmdbMovieDetails>();
  const [error, setError] = useState<OmdbServiceError | null>(null);
  const [loading, setLoading] = useState<boolean>(Boolean(id));
  const [retry, setRetry] = useState(0);
  const { toggleFav, isFav } = useFavorites();

  useEffect(() => {
    if (!id) {
      setData(undefined);
      setError(null);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    let active = true;
    setData(undefined);
    setError(null);
    setLoading(true);
    getMovieById(id, controller.signal)
      .then((data) => {
        if (active) setData(data);
      })
      .catch((error: unknown) => {
        if (!active || (isOmdbServiceError(error) && error.kind === "cancelled")) return;
        if (isOmdbServiceError(error) || isServiceError(error)) {
          setError(error as OmdbServiceError);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [id, retry]);

  return {
    data,
    error,
    errorMessage: error ? getOmdbErrorMessage(error) : null,
    loading,
    retry: () => setRetry((value) => value + 1),
    toggleFav,
    isFav,
  };
};
