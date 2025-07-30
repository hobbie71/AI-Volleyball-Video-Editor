import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { VideoProvider } from "./contexts/video/VideoProvider";
import App from "./app/App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <VideoProvider>
      <App />
    </VideoProvider>
  </StrictMode>
);
