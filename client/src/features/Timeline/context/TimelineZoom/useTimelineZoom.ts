import { useContext } from "react";
import { TimelineZoomContext } from "./TimelineZoomContext";

export const useTimelineZoom = () => {
  const context = useContext(TimelineZoomContext);
  if (!context)
    throw new Error("useTimeline must be within <TimelineProvider>");
  return context;
};
