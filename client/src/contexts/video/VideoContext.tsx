import { createContext, useContext } from "react";
import { VideoContextType } from "./types";

export const VideoContext = createContext<VideoContextType | null>(null);

export const useVideo = () => {
  const context = useContext(VideoContext);
  if (!context) throw new Error("useVideo must be used within a VideoProvider");
  return context;
};
