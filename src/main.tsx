import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { StockProvider } from "./context/StockContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StockProvider>
      <App />
    </StockProvider>
  </StrictMode>
);
