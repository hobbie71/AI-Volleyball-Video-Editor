// Lib imports
import { getCurrentTimelineVideoPlaying } from "../libs/getCurrentTimelineVideoPlaying";

// Hook imports
import { useTimeline } from "../../EditingBar/VideoTimeline/context/useTimeline";
import { useCurrentTime } from "../context/CurrentTime/useCurrentTime";

export const useCurrentTimelineVideo = () => {
  const { currentTimeRef } = useCurrentTime();
  const { timelineVideos } = useTimeline();
  const currentVideo = getCurrentTimelineVideoPlaying(
    currentTimeRef.current,
    timelineVideos
  );

  return { currentVideo };
};
