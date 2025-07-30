import { useContext } from "react";
import { VideoEditingContext } from "./VideoEditingContext";

export const useVideoEditing = () => {
  const context = useContext(VideoEditingContext);
  if (!context)
    throw new Error("useVideoEditing must be within <VideoEditingProvider>");
  return context;
};
