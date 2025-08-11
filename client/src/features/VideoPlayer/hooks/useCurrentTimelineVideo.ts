import { useCallback, useMemo } from "react";

// Lib imports
import { getCurrentTimelineVideoPlaying } from "../libs/getCurrentTimelineVideoPlaying";
import { getVideoElement } from "../libs/getVideoElement";

// Hook imports
import { useTimeline } from "../../Timeline/context/Timeline/useTimeline";
import { useCurrentTime } from "../context/CurrentTime/useCurrentTime";

// Context imports
import { useVideoRendering } from "../context/VideoRendering/useVideoRendering";

export const useCurrentTimelineVideo = () => {
  const { currentTime } = useCurrentTime();
  const { timelineVideos } = useTimeline();
  const { videoRefs } = useVideoRendering();

  // Derive current video/index from state so it updates on render
  const { currentVideo, index } = useMemo(
    () => getCurrentTimelineVideoPlaying(currentTime, timelineVideos),
    [currentTime, timelineVideos]
  );

  const getCurrentVideoElement = useCallback(() => {
    if (!currentVideo) return null;
    return getVideoElement(currentVideo.id, videoRefs.current);
  }, [currentVideo, videoRefs]);

  // Synchronous helpers when you have a specific time (avoid waiting for re-render)
  const getCurrentTimelineVideoAt = useCallback(
    (timeSeconds: number) =>
      getCurrentTimelineVideoPlaying(timeSeconds, timelineVideos).currentVideo,
    [timelineVideos]
  );

  const getCurrentVideoElementAt = useCallback(
    (timeSeconds: number) => {
      const v = getCurrentTimelineVideoAt(timeSeconds);
      return v ? getVideoElement(v.id, videoRefs.current) : null;
    },
    [getCurrentTimelineVideoAt, videoRefs]
  );

  return {
    currentVideo,
    currentVideoIndex: index,
    getCurrentVideoElement,
    getCurrentTimelineVideoAt,
    getCurrentVideoElementAt,
  };
};
