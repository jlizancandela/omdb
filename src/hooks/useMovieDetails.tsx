import { useEffect, useState } from "react";
import type { OmdbMovieDetails } from "../models/omdb";
import { getMovieById } from "../services/omdb";

export const useMovieDetails = (id: string) => {
  const [data, setData] = useState<OmdbMovieDetails>();

  useEffect(() => {
    if (!id) return;
    getMovieById(id)
      .then((data) => setData(data))
      .catch((error) => {
        console.error("Error al obtener datos de OMDb:", error);
        return undefined;
      });
  }, [id]);

  return { data };
};
