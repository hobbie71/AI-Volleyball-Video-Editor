import { useContext } from "react";
import { VideoRenderingContext } from "./VideoRenderingContext";

export const useVideoRendering = () => {
  const context = useContext(VideoRenderingContext);
  if (!context)
    throw new Error(
      "useVideoRendering must be inside <VideoRedneringProvider>"
    );
  return context;
};
