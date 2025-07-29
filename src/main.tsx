import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./pages/App.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import { Movie } from "./pages/Movie.tsx";
import { Provider } from "./context/Provider.tsx";
import { Favorites } from "./pages/Favorites.tsx";
import { Layout } from "./layouts/Layout.tsx";
import AOS from "aos";
import "aos/dist/aos.css";

AOS.init();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<App />} />
            <Route path="/movie/:id" element={<Movie />} />
            <Route path="/search/:movie" element={<App />} />
            <Route path="/favorites" element={<Favorites />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
