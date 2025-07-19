import { useState, useEffect, useCallback } from "react";
import VideoPlayer from "./components/VideoPlayer/VideoPlayer";
import EditingBar from "./components/EditingBar/EditingBar";
import StartPage from "./components/StartPage/StartPage";
import SideBar from "./components/SideBar/SideBar";
import { CurrentTimeProvider } from "./contexts/currentTime/CurrentTimeProvider";
import { VideoEditingProvider } from "./contexts/videoEditing/VideoEditingProvider";
import { useVideo } from "./contexts/video/VideoContext";
import "./App.css";

function App() {
  const { allVideoUploads, allTimelineVideos, uploadVideo } = useVideo();

  const [isVideoPlayerReady, setIsVideoPlayerReady] = useState<boolean>(false);
  const [isDraggingFile, setIsDraggingFile] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // ! useffect: TEMPORARY DEV FUNCTION TO DELETE ALL IMPORTED VIDEOS & FOLDERS
  // useEffect(() => {
  //   const cleanupVideos = async () => {
  //     navigator.sendBeacon("http://localhost:4000/api/cleanup");
  //   };

  //   window.addEventListener("beforeunload", cleanupVideos);

  //   return () => {
  //     window.removeEventListener("beforeunload", cleanupVideos);
  //   };
  // }, []);

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      const invalidFiles = fileArray.filter(
        (file) => !file.type.startsWith("video/")
      );

      if (invalidFiles.length > 0) {
        setErrorMessage("Please Drop Video Files Only");
        return;
      }

      if (fileArray.length > 0) {
        setErrorMessage(null);
        setIsLoading(true);
        try {
          await uploadVideo(fileArray);
        } catch {
          setErrorMessage("Failed to upload or process video");
        } finally {
          setIsLoading(false);
        }
      }
    },
    [uploadVideo]
  );

  // useEffect: handles file drag and drops on window
  useEffect(() => {
    if (isVideoPlayerReady) return;

    const onFileDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsDraggingFile(false);
      if (e.dataTransfer?.files) handleFiles(e.dataTransfer.files);
    };

    const onFileDragOver = (e: DragEvent) => {
      e.preventDefault();
      setIsDraggingFile(true);
    };

    const onFileDragLeave = (e: DragEvent) => {
      e.preventDefault();
      setIsDraggingFile(false);
    };

    window.addEventListener("dragover", onFileDragOver);
    window.addEventListener("dragleave", onFileDragLeave);
    window.addEventListener("drop", onFileDrop);

    return () => {
      window.removeEventListener("dragover", onFileDragOver);
      window.removeEventListener("dragleave", onFileDragLeave);
      window.removeEventListener("drop", onFileDrop);
    };
  }, [handleFiles, isVideoPlayerReady]);

  return (
    <CurrentTimeProvider>
      <VideoEditingProvider>
        {allTimelineVideos.length === 0 && (
          <StartPage setIsLoading={setIsLoading} />
        )}
        <div
          className="main-app-ctn"
          style={{
            display: "flex",
            flexDirection: "row",
            maxHeight: "100vh",
          }}>
          {isVideoPlayerReady && <SideBar />}
          <div style={{ width: "100%", justifyItems: "center" }}>
            {allVideoUploads.length > 0 && (
              <VideoPlayer
                videoPlayerIsReady={() => setIsVideoPlayerReady(true)}
              />
            )}
            {isVideoPlayerReady && <EditingBar />}
          </div>
        </div>
        {isDraggingFile && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              zIndex: 9999,
              border: "2px dashed #1976d2",
              background: "#e3f2fd88",
              pointerEvents: "none",
              transition: "background 0.2s, border 0.2s",
            }}
          />
        )}
        {isLoading && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(255,255,255,0.8)",
              zIndex: 10000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              fontWeight: "bold",
              color: "#1976d2",
            }}>
            Processing video, please wait...
          </div>
        )}
        {errorMessage && (
          <div
            style={{
              position: "fixed",
              top: 20,
              left: "50%",
              transform: "translateX(-50%)",
              background: "#ffebee",
              color: "#c62828",
              padding: "12px 24px",
              borderRadius: 8,
              zIndex: 10000,
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}>
            {errorMessage}
            <button
              style={{
                marginLeft: 16,
                background: "none",
                border: "none",
                color: "#c62828",
                cursor: "pointer",
                fontWeight: "bold",
              }}
              onClick={() => setErrorMessage(null)}>
              ×
            </button>
          </div>
        )}
      </VideoEditingProvider>
    </CurrentTimeProvider>
  );
}

export default App;

/* 
TODOS: Create Backend and Export Video Feature

1. Make it so you can you upload more than one video
2. Create backend
3. Learn ffmpeg
4. Create export feature

! Do backend first so you can make sure it's even possible
! Think about structure and scaleable code
*/
