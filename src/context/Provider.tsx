import { createContext, useState } from "react";
import type { OmdbMovieDetails } from "../models/omdb";
import React from "react";

type AppContextType = {
  lastPage: string;
  setLastpage: React.Dispatch<React.SetStateAction<string>>;
  fav: OmdbMovieDetails[];
  setFav: React.Dispatch<React.SetStateAction<OmdbMovieDetails[]>>;
};

export const Context = createContext<AppContextType | null>(null);

export const Provider = ({ children }: { children: React.ReactNode }) => {
  const [lastPage, setLastpage] = useState("");
  const [fav, setFav] = useState<OmdbMovieDetails[]>([]);

  return (
    <Context value={{ lastPage, setLastpage, fav, setFav }}>{children}</Context>
  );
};
