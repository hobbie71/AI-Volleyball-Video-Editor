// Hook imports
import { useCurrentTimelineVideo } from "../../VideoPlayer/hooks/useCurrentTimelineVideo";

export const useTrimVideo = () => {
  const { currentVideo } = useCurrentTimelineVideo();

  const trimLeftSide = useCallback(() => {
    if (!currentVideo) return;

    setIsVideoPlaying(false);

    const amountTrimmed =
      currentTimeRef.current - currentVideo.timelineStartTime;
    currentVideo.startTime += amountTrimmed;

    updateVideoTimesWhenTrim(currentVideo, amountTrimmed);
    setTimelineTime(currentVideo.timelineStartTime + 0.01);
  }, [
    currentTimeRef,
    getCurrentVideoPlaying,
    setIsVideoPlaying,
    setTimelineTime,
    updateVideoTimesWhenTrim,
  ]);

  const trimRightSide = useCallback(() => {
    const currentVideo = getCurrentVideoPlaying();
    if (!currentVideo) return;

    setIsVideoPlaying(false);

    const amountTrimmed = currentVideo.timelineEndTime - currentTimeRef.current;
    currentVideo.endTime -= amountTrimmed;

    updateVideoTimesWhenTrim(currentVideo, amountTrimmed);
    resetAllVideos();
  }, [
    currentTimeRef,
    getCurrentVideoPlaying,
    resetAllVideos,
    setIsVideoPlaying,
    updateVideoTimesWhenTrim,
  ]);

  return { trimLeftSide, trimRightSide };
};
