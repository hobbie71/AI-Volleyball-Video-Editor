import { useContext } from "react";
import { VideoUploadContext } from "./VideoLibraryContext";

export const useVideoUpload = () => {
  const context = useContext(VideoUploadContext);
  if (!context)
    throw new Error("useVideoLibrary must be between a <VideoLibraryProvider>");

  return context;
};
