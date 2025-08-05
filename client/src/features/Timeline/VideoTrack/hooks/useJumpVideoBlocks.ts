import { useCallback } from "react";

// Hook imports
import { useCurrentTimelineVideo } from "../../../VideoPlayer/hooks/useCurrentTimelineVideo";
import { useVideoPlaybackControl } from "../../../VideoPlayer/hooks/useVideoPlaybackControl";

// Context import
import { useTimeline } from "../../context/Timeline/useTimeline";
import { useCurrentTime } from "../../../VideoPlayer/context/CurrentTime/useCurrentTime";

export const useJumpVideoBlocks = () => {
  const { currentVideo, currentVideoIndex } = useCurrentTimelineVideo();
  const { setIsVideoPlaying, currentTimeRef, updateCurrentTime } =
    useCurrentTime();
  const { resetAllVideoElements } = useVideoPlaybackControl();
  const { timelineVideos, timelineDuration } = useTimeline();

  const jumpToNextBlock = useCallback(() => {
    if (!currentVideo) return;

    setIsVideoPlaying(false);
    resetAllVideoElements();

    if (currentVideoIndex === timelineVideos.length - 1) {
      updateCurrentTime(timelineDuration - 0.01);
    } else {
      const nextVideo = timelineVideos[currentVideoIndex + 1];
      updateCurrentTime(nextVideo.timelineStartTime + 0.01);
    }
  }, [
    currentVideo,
    currentVideoIndex,
    resetAllVideoElements,
    setIsVideoPlaying,
    timelineDuration,
    timelineVideos,
    updateCurrentTime,
  ]);

  const jumpToPreviousBlock = useCallback(() => {
    if (!currentVideo) return;

    setIsVideoPlaying(false);
    resetAllVideoElements();

    if (currentVideoIndex === 0) {
      updateCurrentTime(0);
    } else if (
      currentTimeRef.current ===
      currentVideo.timelineStartTime + 0.01
    ) {
      const prevVideo = timelineVideos[currentVideoIndex - 1];
      updateCurrentTime(prevVideo.timelineStartTime + 0.01);
    } else {
      updateCurrentTime(currentVideo.timelineStartTime + 0.01);
    }
  }, [
    currentTimeRef,
    currentVideo,
    currentVideoIndex,
    resetAllVideoElements,
    setIsVideoPlaying,
    timelineVideos,
    updateCurrentTime,
  ]);

  return { jumpToNextBlock, jumpToPreviousBlock };
};
