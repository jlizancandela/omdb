import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "./context/Provider.tsx";
import AOS from "aos";
import "aos/dist/aos.css";
import { Router } from "./routes/Router.tsx";

AOS.init();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider>
      <Router />
    </Provider>
  </StrictMode>
);
