import { useCallback } from "react";

export const useJumpVideoBlocks = () => {
  const jumpToNextBlock = useCallback(() => {
    const currentVideo = getCurrentVideoPlaying();
    if (!currentVideo)
      throw new Error("No currentVideo. Can't jumpToNextBlock");

    setIsVideoPlaying(false);

    const index = allTimelineVideos.findIndex(
      (video) => video === currentVideo
    );

    if (index === -1) return;

    resetAllVideos();

    if (index === allTimelineVideos.length - 1) {
      setTimelineTime(timelineDuration - 0.01);
      resetAllVideos();
    } else {
      const nextVideo = allTimelineVideos[index + 1];
      setTimelineTime(nextVideo.timelineStartTime + 0.01);
    }
  }, [
    allTimelineVideos,
    getCurrentVideoPlaying,
    resetAllVideos,
    setIsVideoPlaying,
    setTimelineTime,
    timelineDuration,
  ]);

  const jumpToPreviousBlock = useCallback(() => {
    const currentVideo = getCurrentVideoPlaying();
    if (!currentVideo)
      throw new Error("No currentVideo. Can't jumpToNextBlock");

    setIsVideoPlaying(false);

    const index = allTimelineVideos.findIndex(
      (video) => video === currentVideo
    );

    if (index === -1) return;

    resetAllVideos();

    if (index === 0) {
      setTimelineTime(0);
    } else if (
      currentTimeRef.current ===
      currentVideo.timelineStartTime + 0.01
    ) {
      const prevVideo = allTimelineVideos[index - 1];
      setTimelineTime(prevVideo.timelineStartTime + 0.01);
    } else {
      setTimelineTime(currentVideo.timelineStartTime + 0.01);
    }
  }, [
    allTimelineVideos,
    currentTimeRef,
    getCurrentVideoPlaying,
    resetAllVideos,
    setIsVideoPlaying,
    setTimelineTime,
  ]);

  return { jumpToNextBlock, jumpToPreviousBlock };
};
