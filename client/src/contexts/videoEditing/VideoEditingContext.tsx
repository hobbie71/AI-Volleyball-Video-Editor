import { createContext, useContext } from "react";
import { VideoEditingContextType } from "./types";

export const VideoEditingContext =
  createContext<VideoEditingContextType | null>(null);

export const useVideoEditing = () => {
  const ctx = useContext(VideoEditingContext);
  if (!ctx)
    throw new Error("useVideoEditing must be used within VideoEditingProvider");
  return ctx;
};
