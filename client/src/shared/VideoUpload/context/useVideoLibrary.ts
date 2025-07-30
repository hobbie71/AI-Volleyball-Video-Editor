import { useContext } from "react";
import { VideoLibraryContext } from "./VideoLibraryContext";

export const useVideoLibrary = () => {
  const context = useContext(VideoLibraryContext);
  if (!context)
    throw new Error("useVideoLibrary must be between a <VideoLibraryProvider>");

  return context;
};
