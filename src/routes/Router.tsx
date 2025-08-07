import { BrowserRouter, Route, Routes } from "react-router";
import { Layout } from "../layouts/Layout";
import App from "../pages/App";
import { Movie } from "../pages/Movie";
import { Favorites } from "../pages/Favorites";

export const Router = () => {
  return (
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
  );
};
