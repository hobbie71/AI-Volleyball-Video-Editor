import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";

// Provider imports
import { VideoLibraryProvider } from "./shared/VideoUpload/context/VideoLibrary/VideoLibraryContext.tsx";
import { TimelineProvider } from "./features/EditingBar/context/Timeline/TimelineContext.tsx";
import { VideoUploadProvider } from "./shared/VideoUpload/context/VideoUpload/VideoLibraryContext.tsx";
import { VideoRenderingProvider } from "./features/VideoPlayer/context/VideoRendering/VideoRenderingContext.tsx";
import { CurrentTimeProvider } from "./features/VideoPlayer/context/CurrentTime/CurrentTimeContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <VideoLibraryProvider>
      <TimelineProvider>
        <VideoUploadProvider>
          <VideoRenderingProvider>
            <CurrentTimeProvider>
              <App />
            </CurrentTimeProvider>
          </VideoRenderingProvider>
        </VideoUploadProvider>
      </TimelineProvider>
    </VideoLibraryProvider>
  </StrictMode>
);
