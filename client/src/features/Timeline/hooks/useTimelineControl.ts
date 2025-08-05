import { useEffect } from "react";

// Context imports
import { useTimelineZoom } from "../context/TimelineZoom/useTimelineZoom";
import { useTimeline } from "../context/Timeline/useTimeline";

export const useTimelineControl = () => {
  const { setScrollLeft, setZoomDuration } = useTimelineZoom();
  const { timelineContainerRef, timelineDuration } = useTimeline();

  // effect: Update Zoom when file updated
  useEffect(() => {
    setZoomDuration(timelineDuration);
  }, [timelineDuration, setZoomDuration]);

  const setTimelineScrollLeft = (scrollLeft: number) => {
    const timelineContainer = timelineContainerRef.current;
    if (!timelineContainer) return;

    timelineContainer.scrollLeft = scrollLeft;
    setScrollLeft(scrollLeft);
  };

  return { setTimelineScrollLeft };
};
