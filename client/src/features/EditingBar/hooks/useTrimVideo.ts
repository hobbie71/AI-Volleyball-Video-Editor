import { useCallback } from "react";

// Hook imports
import { useCurrentTimelineVideo } from "../../VideoPlayer/hooks/useCurrentTimelineVideo";

// Lib imports
import { getTimelineWhenTrim } from "../VideoTimeline/libs/getTimelineWhenTrim";

// Context imports
import { useTimeline } from "../VideoTimeline/context/useTimeline";
import { useCurrentTime } from "../../VideoPlayer/context/CurrentTime/useCurrentTime";

export const useTrimVideo = () => {
  const { currentVideo } = useCurrentTimelineVideo();
  const { setTimelineVideos, setTimelineDuration } = useTimeline();
  const { setIsVideoPlaying, currentTimeRef } = useCurrentTime();

  const trimLeftSide = useCallback(() => {
    if (!currentVideo) return;

    setIsVideoPlaying(false);

    const amountTrimmed =
      currentTimeRef.current - currentVideo.timelineStartTime;
    currentVideo.startTime += amountTrimmed;

    setTimelineVideos((prev) =>
      getTimelineWhenTrim(currentVideo, amountTrimmed, prev)
    );
    setTimelineDuration((prev) => prev - amountTrimmed);
    // setTimelineTime(currentVideo.timelineStartTime + 0.01);
  }, [
    currentTimeRef,
    currentVideo,
    setIsVideoPlaying,
    setTimelineDuration,
    setTimelineVideos,
  ]);

  const trimRightSide = useCallback(() => {
    if (!currentVideo) return;

    setIsVideoPlaying(false);

    const amountTrimmed = currentVideo.timelineEndTime - currentTimeRef.current;
    currentVideo.endTime -= amountTrimmed;

    setTimelineVideos((prev) =>
      getTimelineWhenTrim(currentVideo, amountTrimmed, prev)
    );
    setTimelineDuration((prev) => prev - amountTrimmed);
    // resetAllVideos();
  }, [
    setIsVideoPlaying,
    setTimelineVideos,
    setTimelineDuration,
    currentTimeRef,
    currentVideo,
  ]);

  return { trimLeftSide, trimRightSide };
};
