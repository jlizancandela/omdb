import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./pages/App.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import { Movie } from "./pages/Movie.tsx";

// TODO: Añadir un Context para los favoritos.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/movie/:id" element={<Movie />} />
        <Route path="/search/:movie" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
