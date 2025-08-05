import { VideoLibraryProvider } from "../VideoUpload/context/VideoLibrary/VideoLibraryContext";
import { TimelineProvider } from "../../features/Timeline/context/Timeline/TimelineContext";
import { VideoUploadProvider } from "../VideoUpload/context/VideoUpload/VideoLibraryContext";
import { VideoRenderingProvider } from "../../features/VideoPlayer/context/VideoRendering/VideoRenderingContext";
import { CurrentTimeProvider } from "../../features/VideoPlayer/context/CurrentTime/CurrentTimeContext";
import { TimelineZoomProvider } from "../../features/Timeline/context/TimelineZoom/TimelineZoomContext";

interface Props {
  children: React.ReactNode;
}

const AppProviders = ({ children }: Props) => {
  return (
    <VideoLibraryProvider>
      <TimelineProvider>
        <VideoUploadProvider>
          <VideoRenderingProvider>
            <CurrentTimeProvider>
              <TimelineZoomProvider>{children}</TimelineZoomProvider>
            </CurrentTimeProvider>
          </VideoRenderingProvider>
        </VideoUploadProvider>
      </TimelineProvider>
    </VideoLibraryProvider>
  );
};

export default AppProviders;
