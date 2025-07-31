// Lib imports
import { getCurrentTimelineVideoPlaying } from "../libs/getCurrentTimelineVideoPlaying";
import { getVideoElement } from "../libs/getVideoElement";

// Hook imports
import { useTimeline } from "../../EditingBar/context/Timeline/useTimeline";
import { useCurrentTime } from "../context/CurrentTime/useCurrentTime";

// Context imports
import { useVideoRendering } from "../context/VideoRendering/useVideoRendering";

export const useCurrentTimelineVideo = () => {
  const { currentTimeRef } = useCurrentTime();
  const { timelineVideos } = useTimeline();
  const { videoRefs } = useVideoRendering();

  const { currentVideo, index } = getCurrentTimelineVideoPlaying(
    currentTimeRef.current,
    timelineVideos
  );

  const getCurrentVideoElement = () => {
    if (!currentVideo) return;
    return getVideoElement(currentVideo.id, videoRefs.current);
  };

  return { currentVideo, currentVideoIndex: index, getCurrentVideoElement };
};
