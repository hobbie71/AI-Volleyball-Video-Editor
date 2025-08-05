// Context imports
import { useTimeline } from "../context/Timeline/useTimeline";
import { useTimelineZoom } from "../context/TimelineZoom/useTimelineZoom";

// Lib imports
import { getTimelineClickedTime } from "../libs/getTimelineClickedTime";

export const useClickedTime = () => {
  const { timelineContainerRef } = useTimeline();
  const { zoomDuration, scrollLeft } = useTimelineZoom();

  const getCurrentClickedTime = (clientX: number): number => {
    const timelineContainer = timelineContainerRef.current;
    if (!timelineContainer)
      throw new Error(
        "Can't getCurrentClickedTime becuase no timelineContainer"
      );

    return getTimelineClickedTime(
      timelineContainer,
      clientX,
      zoomDuration,
      scrollLeft
    );
  };

  return { getCurrentClickedTime };
};
