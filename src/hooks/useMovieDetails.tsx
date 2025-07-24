import { useEffect, useState } from "react";
import type { OmdbMovieDetails } from "../models/omdb";
import { getMovieById } from "../services/omdb";

export const useMovieDetails = (id: string) => {
  const [data, setData] = useState<OmdbMovieDetails>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!id) return;
    getMovieById(id)
      .then((data) => setData(data))
      .catch((error) => {
        setError(error.message);
        return undefined;
      })
      .finally(() => setLoading(false));
  }, [id]);

  return { data, error, loading };
};
