import { VideoLibraryProvider } from "../VideoUpload/context/VideoLibrary/VideoLibraryContext";
import { TimelineProvider } from "../../features/Timeline/context/Timeline/TimelineContext";
import { VideoUploadProvider } from "../VideoUpload/context/VideoUpload/VideoLibraryContext";
import { VideoRenderingProvider } from "../../features/VideoPlayer/context/VideoRendering/VideoRenderingContext";
import { CurrentTimeProvider } from "../../features/VideoPlayer/context/CurrentTime/CurrentTimeContext";
import { TimelineZoomProvider } from "../../features/Timeline/context/TimelineZoom/TimelineZoomContext";
import { ExportSettingsProvider } from "../../features/SideBar/context/ExportSettingsContext";
import { VideoEditingProvider } from "../../features/Timeline/context/VideoEditing/VideoEditingContext";

interface Props {
  children: React.ReactNode;
}

const AppProviders = ({ children }: Props) => {
  return (
    <ExportSettingsProvider>
      <VideoLibraryProvider>
        <TimelineProvider>
          <VideoUploadProvider>
            <VideoRenderingProvider>
              <CurrentTimeProvider>
                <VideoEditingProvider>
                  <TimelineZoomProvider>{children}</TimelineZoomProvider>
                </VideoEditingProvider>
              </CurrentTimeProvider>
            </VideoRenderingProvider>
          </VideoUploadProvider>
        </TimelineProvider>
      </VideoLibraryProvider>
    </ExportSettingsProvider>
  );
};

export default AppProviders;
