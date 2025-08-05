import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";

// Provider imports
import AppProviders from "./shared/context/AppProviders.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>
);
