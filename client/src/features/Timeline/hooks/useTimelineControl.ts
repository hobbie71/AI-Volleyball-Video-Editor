import { useCallback, useEffect } from "react";

// Context imports
import { useTimelineZoom } from "../context/TimelineZoom/useTimelineZoom";
import { useTimeline } from "../context/Timeline/useTimeline";
import { useCurrentTime } from "../../VideoPlayer/context/CurrentTime/useCurrentTime";

// Hook imports
import { useDrawFrame } from "../../VideoPlayer/hooks/useDrawFrame";
import { useVideoPlaybackControl } from "../../VideoPlayer/hooks/useVideoPlaybackControl";
import { useCurrentTimelineVideo } from "../../VideoPlayer/hooks/useCurrentTimelineVideo";

export const useTimelineControl = () => {
  const { setScrollLeft, setZoomDuration } = useTimelineZoom();
  const { timelineContainerRef, timelineDuration } = useTimeline();
  const { drawFrameAtTime } = useDrawFrame();
  const { updateCurrentTime } = useCurrentTime();
  const { resetAllVideoElementsExcept } = useVideoPlaybackControl();
  const { getCurrentTimelineVideoAt } = useCurrentTimelineVideo();

  // effect: Update Zoom when file updated
  useEffect(() => {
    setZoomDuration(timelineDuration);
  }, [timelineDuration, setZoomDuration]);

  const setTimelineScrollLeft = useCallback(
    (scrollLeft: number) => {
      const timelineContainer = timelineContainerRef.current;
      if (!timelineContainer) return;

      timelineContainer.scrollLeft = scrollLeft;
      setScrollLeft(scrollLeft);
    },
    [setScrollLeft, timelineContainerRef]
  );

  const setTimelineTime = useCallback(
    async (timeSeconds: number) => {
      updateCurrentTime(timeSeconds);
      drawFrameAtTime(timeSeconds);
      const timelineVideo = getCurrentTimelineVideoAt(timeSeconds);
      if (timelineVideo) resetAllVideoElementsExcept(timelineVideo);
    },
    [
      drawFrameAtTime,
      updateCurrentTime,
      resetAllVideoElementsExcept,
      getCurrentTimelineVideoAt,
    ]
  );

  return { setTimelineScrollLeft, setTimelineTime };
};
