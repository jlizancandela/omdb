import { createContext, useState } from "react";
import type { OmdbMovieShort } from "../models/omdb";
import React from "react";

type AppContextType = {
  lastPage: string;
  setLastpage: React.Dispatch<React.SetStateAction<string>>;
  fav: OmdbMovieShort[];
  setFav: React.Dispatch<React.SetStateAction<OmdbMovieShort[]>>;
};

export const Context = createContext<AppContextType | null>(null);

export const Provider = ({ children }: { children: React.ReactNode }) => {
  const [lastPage, setLastpage] = useState("");

  const [fav, setFav] = useState<OmdbMovieShort[]>(() => {
    const stored = localStorage.getItem("favorites");
    return stored ? JSON.parse(stored) : [];
  });

  React.useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(fav));
  }, [fav]);

  return (
    <Context value={{ lastPage, setLastpage, fav, setFav }}>{children}</Context>
  );
};
